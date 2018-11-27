/* @flow */

function nodesToArray(nodes: NodeList<HTMLElement> | HTMLCollection<HTMLElement>): Array<HTMLElement> {
  return Array.prototype.slice.call(nodes)
}

/**
 * This models the taxonomy shown in the miller columns and the current state
 * of it.
 * It notifies the miller columns element when it has changed state to update
 * the UI
 */
class Taxonomy {
  topics: Array<Topic>
  millerColumns: MillerColumnsElement
  // At any time there is one or no active topic, the active topic determines
  // what part of the taxonomy is currently shown to the user (i.e which level)
  // if this is null a user is shown the root column
  active: ?Topic

  constructor(topics: Array<Topic>, millerColumns: MillerColumnsElement) {
    this.topics = topics
    this.millerColumns = millerColumns
    this.active = this.selectedTopics[0]
  }

  /** fetches all the topics that are currently selected */
  get selectedTopics(): Array<Topic> {
    return this.topics.reduce((memo, topic) => {
      if (topic.selected) {
        memo.push(topic)
      }

      return memo.concat(topic.selectedChildren)
    }, [])
  }

  /** Handler for a topic in the miller columns being clicked */
  topicClicked(topic: Topic) {
    // if this is the active topic or a parent of it we deselect
    if (topic === this.active || topic.parentOf(this.active)) {
      topic.deselect(true)
      this.active = topic.parent
    } else if (topic.selected || topic.selectedChildren.length) {
      // if this is a selected topic with children we make it active to allow
      // picking the children
      if (topic.children.length) {
        this.active = topic
      } else {
        // otherwise we deselect it as we know the user can't be traversing
        topic.deselect(true)
        this.active = topic.parent
      }
    } else {
      // otherwise this is a new selection
      topic.select()
      this.active = topic
    }

    this.millerColumns.update()
  }

  /** Handler for when a topic is removed via the selected element */
  removeTopic(topic: Topic) {
    topic.deselect(false)
    // determine which topic to mark as active, if any
    this.active = this.determineActiveFromRemoved(topic)
    this.millerColumns.update()
  }

  /** Calculate most relevant topic to show user after they've removed a topic */
  determineActiveFromRemoved(topic: Topic): ?Topic {
    // if there is already an active item with selected children lets not
    // change anything
    if (this.active && (this.active.selected || this.active.selectedChildren.length)) {
      return this.active
    }

    // see if there is a parent with selected topics, that feels like the most
    // natural place to end up
    for (const parent of topic.parents.reverse()) {
      if (parent.selectedChildren.length) {
        return parent
      }
    }

    // if we've still not got one we'll go for the first selected one
    return this.selectedTopics[0]
  }
}

/**
 * Represents a single topic in the taxonomy and knows whether it is currently
 * selected or not
 */
class Topic {
  static fromList(list: ?HTMLElement, parent: ?Topic = null) {
    const topics = []
    if (!list) {
      return topics
    }

    for (const item of list.children) {
      const label = item.querySelector('label')
      const checkbox = item.querySelector('input')
      if (label instanceof HTMLLabelElement && checkbox instanceof HTMLInputElement) {
        let childList = item.querySelector('ul')
        childList = childList instanceof HTMLUListElement ? childList : null

        const topic = new Topic(label, checkbox, childList, parent)
        topics.push(topic)
      }
    }

    return topics
  }

  label: HTMLLabelElement
  checkbox: HTMLInputElement
  children: Array<Topic>
  parent: ?Topic
  // Whether this topic is selected, we only allow one item in a branch of the
  // taxonomy to be selected.
  // E.g. given education > school > 6th form only one of these can be selected
  // at a time and the parents are implicity selected from it
  selected: boolean

  constructor(label: HTMLLabelElement, checkbox: HTMLInputElement, childList: ?HTMLUListElement, parent: ?Topic) {
    this.label = label
    this.checkbox = checkbox
    this.parent = parent
    this.children = Topic.fromList(childList, this)

    if (!this.children.length && this.checkbox.checked) {
      this.selected = true
      if (this.parent) {
        this.parent.childWasSelected()
      }
    } else {
      this.selected = false
    }
  }

  /** The presence of selected children determines whether this item is considered selected */
  get selectedChildren(): Array<Topic> {
    return this.children.reduce((memo, topic) => {
      const selected = topic.selectedChildren
      if (topic.selected) {
        selected.push(topic)
      }
      return memo.concat(selected)
    }, [])
  }

  get parents(): Array<Topic> {
    if (this.parent) {
      return this.parent.parents.concat([this.parent])
    } else {
      return []
    }
  }

  /** Whether this topic is the parent of a different one */
  parentOf(other: ?Topic): boolean {
    if (!other) {
      return false
    }

    for (const topic of this.children) {
      if (topic === other || topic.parentOf(other)) {
        return true
      }
    }

    return false
  }

  withParents(): Array<Topic> {
    return this.parents.concat([this])
  }

  /** Attempts to select this topic assuming it's not alrerady selected or has selected children */
  select() {
    // if already selected or a child is selected do nothing
    if (this.selected || this.selectedChildren.length) {
      return
    }
    this.selected = true
    this.checkbox.checked = true
    if (this.parent) {
      this.parent.childWasSelected()
    }
  }

  /**
   * Deselects this topic. If this item is not itself selected but a child of it
   * is then it traverses to that child and deselects it.
   * Takes an optional argument as to whether to select the parent after deselection
   * Doing this allows a user to stay in context of their selection in the miller
   * column element as deselecting the whole tree would take them back to root
   */
  deselect(selectParent: boolean = true) {
    // if this item is selected explicitly we can deselect it
    if (this.selected) {
      this.deselectSelfAndParents()
    } else {
      // otherwise we need to find the selected children to start deselecting
      const selectedChildren = this.selectedChildren

      // if we have none it's a no-op
      if (!selectedChildren.length) {
        return
      }

      for (const child of selectedChildren) {
        child.deselect(false)
      }
    }

    if (selectParent && this.parent) {
      this.parent.select()
    }
  }

  deselectSelfAndParents() {
    // loop through the parents only deselecting items that don't have other
    // selected children
    for (const topic of this.withParents().reverse()) {
      if (topic.selectedChildren.length) {
        break
      } else {
        topic.selected = false
        topic.checkbox.checked = false
      }
    }
  }

  /** If a child is selected we need to implicitly select all the parents */
  childWasSelected() {
    this.checkbox.checked = true
    this.selected = false
    if (this.parent) {
      this.parent.childWasSelected()
    }
  }
}

class MillerColumnsElement extends HTMLElement {
  taxonomy: Taxonomy
  classNames: Object

  constructor() {
    super()
    this.classNames = {
      column: 'miller-columns__column',
      columnCollapse: 'miller-columns__column--collapse',
      columnNarrow: 'miller-columns__column--narrow',
      item: 'miller-columns__item',
      itemParent: 'miller-columns__item--parent',
      itemActive: 'miller-columns__item--active',
      itemSelected: 'miller-columns__item--selected'
    }
  }

  connectedCallback() {
    const source = document.getElementById(this.getAttribute('for') || '')
    if (source) {
      this.taxonomy = new Taxonomy(Topic.fromList(source), this)
      this.renderTaxonomyColumn(this.taxonomy.topics, true)
      this.update()
      if (source.parentNode) {
        source.parentNode.removeChild(source)
      }
      this.style.display = 'block'
    }
  }

  /** Returns the element which shows the selections a user has made */
  get selectedElement(): ?MillerColumnsSelectedElement {
    const selected = document.getElementById(this.getAttribute('selected') || '')
    return selected instanceof MillerColumnsSelectedElement ? selected : null
  }

  /** Build and insert a column of the taxonomy */
  renderTaxonomyColumn(topics: Array<Topic>, root: boolean = false) {
    const ul = document.createElement('ul')
    ul.className = this.classNames.column
    if (root) {
      ul.dataset.root = 'true'
    } else {
      ul.classList.add(this.classNames.columnCollapse)
    }
    this.appendChild(ul)
    for (const topic of topics) {
      this.renderTopic(topic, ul)
    }
  }

  /** Build and insert a list item for a topic */
  renderTopic(topic: Topic, list: HTMLElement) {
    const li = document.createElement('li')
    li.classList.add(this.classNames.item)
    const div = document.createElement('div')
    div.className = 'govuk-checkboxes__item'
    div.appendChild(topic.checkbox)
    div.appendChild(topic.label)
    li.appendChild(div)
    list.appendChild(li)
    this.attachEvents(li, topic)

    if (topic.children.length) {
      li.classList.add(this.classNames.itemParent)
      this.renderTaxonomyColumn(topic.children)
    }
  }

  /** Sets up the event handling for a list item and a topic */
  attachEvents(trigger: HTMLElement, topic: Topic) {
    trigger.tabIndex = 0
    trigger.addEventListener('click', () => this.taxonomy.topicClicked(topic), false)
    trigger.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if ([' ', 'Enter'].indexOf(event.key) !== -1) {
          event.preventDefault()
          this.taxonomy.topicClicked(topic)
        }
      },
      false
    )
  }

  /** Update this element to show a change in the state */
  update() {
    this.showSelectedTopics(this.taxonomy.selectedTopics)
    this.showActiveTopic(this.taxonomy.active)
    this.showCurrentColumns(this.taxonomy.active)

    if (this.selectedElement) {
      this.selectedElement.update(this.taxonomy)
    }
  }

  /**
   * Utility method to swap class names over for a group of elements
   * Takes an array of all elements that should have a class and removes it
   * from any other items that have it
   */
  updateClassName(className: string, items: Array<HTMLElement>) {
    const currentlyWithClass = nodesToArray(this.getElementsByClassName(className))

    for (const item of currentlyWithClass.concat(items)) {
      if (!item) {
        continue
      }

      if (items.indexOf(item) !== -1) {
        item.classList.add(className)
      } else {
        item.classList.remove(className)
      }
    }
  }

  /** Given an array of selected topics update the UI */
  showSelectedTopics(selectedTopics: Array<Topic>) {
    const selectedItems = selectedTopics.reduce((memo, child) => {
      for (const topic of child.withParents()) {
        const item = topic.checkbox.closest(`.${this.classNames.item}`)
        if (item instanceof HTMLElement) {
          memo.push(item)
        }
      }

      return memo
    }, [])

    this.updateClassName(this.classNames.itemSelected, selectedItems)
  }

  /** Update the topic items for the presence (or not) of an active topic */
  showActiveTopic(activeTopic: ?Topic) {
    let activeItems

    if (!activeTopic) {
      activeItems = []
    } else {
      activeItems = activeTopic.withParents().reduce((memo, topic) => {
        const item = topic.checkbox.closest(`.${this.classNames.item}`)

        if (item instanceof HTMLElement) {
          memo.push(item)
        }

        return memo
      }, [])
    }
    this.updateClassName(this.classNames.itemActive, activeItems)
  }

  /** Change what columns are visible based on the active (or not) topic */
  showCurrentColumns(activeTopic: ?Topic) {
    const allColumns = nodesToArray(this.getElementsByClassName(this.classNames.column))
    const columnsToShow = this.columnsForActiveTopic(activeTopic)
    const narrowThreshold = 3
    const showNarrow = columnsToShow.length > narrowThreshold
    const {columnCollapse: collapseClass, columnNarrow: narrowClass} = this.classNames

    for (const item of allColumns) {
      if (!item) {
        continue
      }

      // we always want to show the root column
      if (item.dataset.root === 'true') {
        showNarrow ? item.classList.add(narrowClass) : item.classList.remove(narrowClass)
        continue
      }

      const index = columnsToShow.indexOf(item)

      if (index === -1) {
        // this is not a column to show
        item.classList.add(collapseClass)
      } else if (showNarrow && index < narrowThreshold) {
        // show this column but narrow
        item.classList.remove(collapseClass)
        item.classList.add(narrowClass)
      } else {
        // show this column in all it's glory
        item.classList.remove(collapseClass, narrowClass)
      }
    }
  }

  /** Determine which columns should be shown based on the active topic */
  columnsForActiveTopic(activeTopic: ?Topic): Array<HTMLElement> {
    if (!activeTopic) {
      return []
    }

    const columnSelector = `.${this.classNames.column}`
    const columns = activeTopic.withParents().reduce((memo, topic) => {
      const column = topic.checkbox.closest(columnSelector)
      if (column instanceof HTMLElement) {
        memo.push(column)
      }

      return memo
    }, [])

    // we'll want to show the next column too for the next choices
    if (activeTopic.children.length) {
      const nextColumn = activeTopic.children[0].checkbox.closest(columnSelector)
      if (nextColumn instanceof HTMLElement) {
        columns.push(nextColumn)
      }
    }
    return columns
  }
}

class MillerColumnsSelectedElement extends HTMLElement {
  list: HTMLElement
  taxonomy: ?Taxonomy

  constructor() {
    super()
  }

  connectedCallback() {
    this.list = document.createElement('ol')
    this.list.className = 'miller-columns-selected__list'
    this.appendChild(this.list)
    if (this.millerColumnsElement && this.millerColumnsElement.taxonomy) {
      this.update(this.millerColumnsElement.taxonomy)
    }
  }

  get millerColumnsElement(): ?MillerColumnsElement {
    const millerColumns = document.getElementById(this.getAttribute('for') || '')
    return millerColumns instanceof MillerColumnsElement ? millerColumns : null
  }

  /** Update the UI to show the selected topics */
  update(taxonomy: Taxonomy) {
    this.taxonomy = taxonomy
    const selectedTopics = taxonomy.selectedTopics
    // seems simpler to nuke the list and re-build it
    while (this.list.lastChild) {
      this.list.removeChild(this.list.lastChild)
    }

    if (selectedTopics.length) {
      for (const topic of selectedTopics) {
        this.addSelectedTopic(topic)
      }
    } else {
      const li = document.createElement('li')
      li.className = 'miller-columns-selected__list-item'
      li.textContent = 'No selected topics'
      this.list.appendChild(li)
    }
  }

  addSelectedTopic(topic: Topic) {
    const li = document.createElement('li')
    li.className = 'miller-columns-selected__list-item'
    li.appendChild(this.breadcrumbsElement(topic))
    li.appendChild(this.removeTopicElement(topic))
    this.list.appendChild(li)
  }

  breadcrumbsElement(topic: Topic): HTMLElement {
    const div = document.createElement('div')
    div.className = 'govuk-breadcrumbs'
    const ol = document.createElement('ol')
    ol.className = 'govuk-breadcrumbs__list'
    for (const current of topic.withParents()) {
      const li = document.createElement('li')
      li.className = 'govuk-breadcrumbs__list-item'
      li.textContent = current.label.textContent
      ol.appendChild(li)
    }
    div.appendChild(ol)
    return div
  }

  removeTopicElement(topic: Topic): HTMLElement {
    const button = document.createElement('button')
    button.className = 'miller-columns-selected__remove-topic'
    button.textContent = 'Remove topic'
    button.setAttribute('type', 'button')
    button.addEventListener('click', () => {
      if (this.taxonomy) {
        this.taxonomy.removeTopic(topic)
      }
    })
    return button
  }
}

if (!window.customElements.get('miller-columns')) {
  window.MillerColumnsElement = MillerColumnsElement
  window.customElements.define('miller-columns', MillerColumnsElement)
}

if (!window.customElements.get('miller-columns-selected')) {
  window.MillerColumnsSelectedElement = MillerColumnsSelectedElement
  window.customElements.define('miller-columns-selected', MillerColumnsSelectedElement)
}

export {MillerColumnsElement, MillerColumnsSelectedElement}
