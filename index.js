/* @flow */

function nodesToArray(nodes: NodeList<HTMLElement> | HTMLCollection<HTMLElement>): Array<HTMLElement> {
  return Array.prototype.slice.call(nodes)
}

function triggerEvent(element: HTMLElement, eventName: string, detail: Object) {
  const params = {bubbles: true, cancelable: true, detail: detail || null}
  let event

  if (typeof window.CustomEvent === 'function') {
    event = new window.CustomEvent(eventName, params)
  } else {
    event = document.createEvent('CustomEvent')
    event.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail)
  }

  element.dispatchEvent(event)
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

  get flattenedTopics(): Array<Topic> {
    return this.topics.reduce((memo, topic) => {
      memo.push(topic)
      return memo.concat(topic.flattenedChildren)
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

    const children = Array.from(list.children)

    for (const [index, item] of children.entries()) {
      const label = item.querySelector('label')
      const checkbox = item.querySelector('input')
      if (label instanceof HTMLLabelElement && checkbox instanceof HTMLInputElement) {
        let childList = item.querySelector('ul')
        childList = childList instanceof HTMLUListElement ? childList : null

        checkbox.tabIndex = -1

        const previous = index > 0 ? topics[index - 1] : null

        const topic = new Topic(label, checkbox, childList, parent, previous)

        if (index > 0) {
          topics[index - 1].next = topic
        }

        topics.push(topic)
      }
    }

    return topics
  }

  label: HTMLLabelElement
  checkbox: HTMLInputElement
  children: Array<Topic>
  parent: ?Topic
  next: ?Topic
  previous: ?Topic
  // Whether this topic is selected, we only allow one item in a branch of the
  // taxonomy to be selected.
  // E.g. given education > school > 6th form only one of these can be selected
  // at a time and the parents are implicity selected from it
  selected: boolean

  constructor(
    label: HTMLLabelElement,
    checkbox: HTMLInputElement,
    childList: ?HTMLUListElement,
    parent: ?Topic,
    previous: ?Topic
  ) {
    this.label = label
    this.checkbox = checkbox
    this.parent = parent
    this.children = Topic.fromList(childList, this)
    this.previous = previous

    if (this.checkbox.checked) {
      this.select()
    } else {
      this.selected = false
    }
  }

  get topicName(): string {
    return this.label.textContent.replace(/(^\s+|\s+$)/g, '')
  }

  get topicNames(): Array<string> {
    const items = []
    for (const parent of this.parents) {
      items.push(parent.topicName)
    }
    items.push(this.topicName)
    return items
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

  get flattenedChildren(): Array<Topic> {
    return this.children.reduce((memo, topic) => {
      memo.push(topic)
      return memo.concat(topic.flattenedChildren)
    }, [])
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
  describedbyId: ?string

  constructor() {
    super()
    this.classNames = {
      column: 'miller-columns__column',
      columnHeading: 'miller-columns__column-heading',
      backLink: 'govuk-back-link',
      columnList: 'miller-columns__column-list',
      columnCollapse: 'miller-columns__column--collapse',
      columnMedium: 'miller-columns__column--medium',
      columnNarrow: 'miller-columns__column--narrow',
      columnActive: 'miller-columns__column--active',
      item: 'miller-columns__item',
      itemParent: 'miller-columns__item--parent',
      itemActive: 'miller-columns__item--active',
      itemSelected: 'miller-columns__item--selected'
    }
  }

  connectedCallback() {
    this.describedbyId = this.getAttribute('aria-describedby')

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
    const div = document.createElement('div')

    if (!root) {
      // Append back link
      const backLink = document.createElement('button')
      backLink.className = this.classNames.backLink
      backLink.type = 'button'
      backLink.innerHTML = 'Back'
      backLink.addEventListener(
        'click',
        () => {
          if (topics[0].parent) {
            this.showCurrentColumns(topics[0].parent.parent)
          }
        },
        false
      )
      div.appendChild(backLink)

      // Append heading
      const h3 = document.createElement('h3')
      h3.className = this.classNames.columnHeading
      const parentTopicName = topics[0].parent ? topics[0].parent.topicName : null
      if (parentTopicName) {
        h3.innerHTML = parentTopicName
      }
      div.appendChild(h3)
    }

    // Append list
    const ul = document.createElement('ul')
    ul.className = this.classNames.columnList
    div.className = this.classNames.column
    if (root) {
      div.dataset.root = 'true'
    } else {
      div.classList.add(this.classNames.columnCollapse)
    }
    div.appendChild(ul)

    // Append column
    this.appendChild(div)

    for (const topic of topics) {
      this.renderTopic(topic, ul)
    }
  }

  /** Build and insert a list item for a topic */
  renderTopic(topic: Topic, list: HTMLElement) {
    const li = document.createElement('li')
    li.classList.add(this.classNames.item)
    li.classList.add('govuk-checkboxes--small')
    if (this.describedbyId) {
      li.setAttribute('aria-describedby', this.describedbyId)
    }

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

  /** Focus the miller columns item associated with a topic */
  focusTopic(topic: ?Topic) {
    if (topic instanceof Topic && topic.checkbox) {
      const item = topic.checkbox.closest(`.${this.classNames.item}`)
      if (item instanceof HTMLElement) {
        item.focus()
      }
    }
  }

  /** Sets up the event handling for a list item and a topic */
  attachEvents(trigger: HTMLElement, topic: Topic) {
    trigger.tabIndex = 0
    trigger.addEventListener(
      'click',
      () => {
        this.taxonomy.topicClicked(topic)
        topic.checkbox.dispatchEvent(new Event('click'))
      },
      false
    )
    trigger.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        switch (event.key) {
          case ' ':
          case 'Enter':
            event.preventDefault()
            this.taxonomy.topicClicked(topic)
            topic.checkbox.dispatchEvent(new Event('click'))
            break
          case 'ArrowUp':
            event.preventDefault()
            if (topic.previous) {
              this.showCurrentColumns(topic.previous)
              this.focusTopic(topic.previous)
            }
            break
          case 'ArrowDown':
            event.preventDefault()
            if (topic.next) {
              this.showCurrentColumns(topic.next)
              this.focusTopic(topic.next)
            }
            break
          case 'ArrowLeft':
            event.preventDefault()
            if (topic.parent) {
              this.showCurrentColumns(topic.parent)
              this.focusTopic(topic.parent)
            }
            break
          case 'ArrowRight':
            event.preventDefault()
            if (topic.children) {
              this.showCurrentColumns(topic.children[0])
              this.focusTopic(topic.children[0])
            }
            break
          default:
            return
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
    const columnsToShow = activeTopic ? this.columnsForActiveTopic(activeTopic) : [allColumns[0]]
    const narrowThreshold = Math.max(3, columnsToShow.length - 1)
    const showNarrow = columnsToShow.length > narrowThreshold
    const showMedium = showNarrow && narrowThreshold === 3
    const {
      columnCollapse: collapseClass,
      columnNarrow: narrowClass,
      columnMedium: mediumClass,
      columnActive: activeClass
    } = this.classNames

    for (const item of allColumns) {
      if (!item) {
        continue
      }

      item.classList.remove(activeClass)
      // we always want to show the root column
      if (item.dataset.root === 'true') {
        item.classList.remove(narrowClass, mediumClass)
        if (showMedium) {
          item.classList.add(mediumClass)
        } else if (showNarrow) {
          item.classList.add(narrowClass)
        }
        if (columnsToShow.length === 1) {
          item.classList.add(activeClass)
        }
        continue
      }

      const index = columnsToShow.indexOf(item)

      if (index === -1) {
        // this is not a column to show
        item.classList.add(collapseClass)
      } else if (showNarrow && index < narrowThreshold) {
        // show this column but narrow
        item.classList.remove(collapseClass, narrowClass, mediumClass)
        if (showMedium) {
          item.classList.add(mediumClass)
        } else if (showNarrow) {
          item.classList.add(narrowClass)
        }
      } else {
        // show this column in all it's glory
        item.classList.remove(collapseClass, narrowClass, mediumClass)
      }

      // mark last visible column as active
      if (item === columnsToShow[columnsToShow.length - 1]) {
        item.classList.add(activeClass)
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
      triggerEvent(button, 'remove-topic', topic)
      if (this.taxonomy) {
        this.taxonomy.removeTopic(topic)
      }
    })

    const span = document.createElement('span')
    span.className = 'govuk-visually-hidden'
    span.textContent = `: ${topic.topicName}`
    button.appendChild(span)

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
