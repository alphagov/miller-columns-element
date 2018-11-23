/* @flow */

function nodesToArray(nodes: NodeList<HTMLElement> | HTMLCollection<HTMLElement>): Array<HTMLElement> {
  return Array.prototype.slice.call(nodes)
}

class Taxonomy {
  topics: Array<Topic>
  millerColumns: MillerColumnsElement
  active: ?Topic
  constructor(topics: Array<Topic>, millerColumns: MillerColumnsElement) {
    this.topics = topics
    this.millerColumns = millerColumns
    this.active = this.selectedTopics[0]
  }

  get selectedTopics(): Array<Topic> {
    return this.topics.reduce((memo, topic) => {
      if (topic.selected) {
        memo.push(topic)
      }

      return memo.concat(topic.selectedChildren)
    }, [])
  }

  toggleSelection(topic: Topic) {
    // if this is the active topic or a parent of it we deselect
    if (topic === this.active || topic.parentOf(this.active)) {
      topic.deselect()
      if (topic.parent) {
        topic.parent.select()
      }
      this.active = topic.parent
    } else if (topic.selected || topic.selectedChildren.length) {
      // if this is a selected topic with children we make it active to allow
      // picking the children
      if (topic.children.length) {
        this.active = topic
      } else {
        // otherwise we deselect it as we take the click as they can't be
        // traversing
        topic.deselect()
        if (topic.parent) {
          topic.parent.select()
        }
        this.active = topic.parent
      }
    } else {
      // otherwise this is a new selection
      topic.select()
      this.active = topic
    }

    this.millerColumns.update()
  }

  removeTopic(topic: Topic) {
    topic.deselect()
    // determine which topic to mark as active, if any
    this.active = this.determineActiveFromRemoved(topic)
    this.millerColumns.update()
  }

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
    }
  }

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

  parentOf(other: ?Topic): boolean {
    if (!other) {
      return false
    }

    return this.children.reduce((memo, topic) => {
      if (memo) {
        return true
      }

      return topic === other || topic.parentOf(other)
    }, false)
  }

  withParents(): Array<Topic> {
    return this.parents.concat([this])
  }

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

  deselect() {
    if (this.selected) {
      const deepestFirst = this.withParents().reverse()

      for (const topic of deepestFirst) {
        // if the parent has selected children it should remain ticked
        if (topic.selectedChildren.length) {
          break
        } else {
          topic.selected = false
          topic.checkbox.checked = false
        }
      }

      return
    }

    const selectedChildren = this.selectedChildren
    if (selectedChildren.length) {
      for (const child of selectedChildren) {
        child.deselect()
      }
    }
  }

  childWasSelected() {
    // we need each checkbox to be selected for the UI
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
      column: 'govuk-miller-columns__column',
      columnCollapse: 'govuk-miller-columns__column--collapse',
      columnNarrow: 'govuk-miller-columns__column--narrow',
      item: 'govuk-miller-columns__item',
      itemParent: 'govuk-miller-columns__item--parent',
      itemSelected: 'govuk-miller-columns__item--selected',
      itemStored: 'govuk-miller-columns__item--stored'
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

  get selectedElement(): ?MillerColumnsSelectedElement {
    const selected = document.getElementById(this.getAttribute('selected') || '')
    return selected instanceof MillerColumnsSelectedElement ? selected : null
  }

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

  attachEvents(trigger: HTMLElement, topic: Topic) {
    trigger.tabIndex = 0
    trigger.addEventListener('click', () => this.selectTopic(topic), false)
    trigger.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if ([' ', 'Enter'].indexOf(event.key) !== -1) {
          event.preventDefault()
          this.selectTopic(topic)
        }
      },
      false
    )
  }

  selectTopic(topic: Topic) {
    this.taxonomy.toggleSelection(topic)
  }

  update() {
    this.showStoredTopics(this.taxonomy.selectedTopics)
    this.showActiveTopic(this.taxonomy.active)

    if (this.selectedElement) {
      this.selectedElement.update(this.taxonomy)
    }
  }

  showStoredTopics(topics: Array<Topic>) {
    const storedItems = this.itemsForStoredTopics(topics)
    const currentlyStored = nodesToArray(this.getElementsByClassName(this.classNames.itemStored))

    for (const item of currentlyStored.concat(storedItems)) {
      if (storedItems.indexOf(item) !== -1) {
        item.classList.add(this.classNames.itemStored)
      } else {
        item.classList.remove(this.classNames.itemStored)
      }
    }
  }

  showActiveTopic(topic: ?Topic) {
    const activeItems = this.itemsForActiveTopic(topic)
    const currentlyActive = nodesToArray(this.getElementsByClassName(this.classNames.itemSelected))

    for (const item of currentlyActive.concat(activeItems)) {
      if (!item) {
        continue
      }

      if (activeItems.indexOf(item) !== -1) {
        item.classList.add(this.classNames.itemSelected)
      } else {
        item.classList.remove(this.classNames.itemSelected)
      }
    }

    const allColumns = nodesToArray(this.getElementsByClassName(this.classNames.column))
    const columnsToShow = this.columnsForActiveTopic(topic)

    for (const item of allColumns) {
      // we always want to show the root column
      if (item.dataset.root === 'true') {
        continue
      }
      if (columnsToShow.indexOf(item) !== -1) {
        item.classList.remove(this.classNames.columnCollapse)
      } else {
        item.classList.add(this.classNames.columnCollapse)
      }
    }

    if (columnsToShow.length > 3) {
      // make all but the last column narrow
      for (let index = 0; index < columnsToShow.length; index++) {
        const col = columnsToShow[index]

        if (!col) {
          continue
        }

        if (index === columnsToShow.length - 1) {
          col.classList.remove(this.classNames.columnNarrow)
        } else {
          col.classList.add(this.classNames.columnNarrow)
        }
      }
    } else {
      // make sure none of the columns are narrow
      for (const col of allColumns) {
        col.classList.remove(this.classNames.columnNarrow)
      }
    }
  }

  itemsForActiveTopic(topic: ?Topic) {
    if (!topic) {
      return []
    }

    return topic.withParents().reduce((memo, topic) => {
      const item = topic.checkbox.closest(`.${this.classNames.item}`)
      return memo.concat([item])
    }, [])
  }

  itemsForStoredTopics(topics: Array<Topic>): Array<HTMLElement> {
    return topics.reduce((memo, child) => {
      for (const topic of child.withParents()) {
        const item = topic.checkbox.closest(`.${this.classNames.item}`)
        if (item instanceof HTMLElement) {
          memo.push(item)
        }
      }

      return memo
    }, [])
  }

  columnsForActiveTopic(topic: ?Topic) {
    if (!topic) {
      return []
    }

    const columnSelector = `.${this.classNames.column}`
    const columns = topic.withParents().reduce((memo, topic) => {
      const column = topic.checkbox.closest(columnSelector)
      return memo.concat([column])
    }, [])

    // we'll want to show the next column too
    if (topic.children.length) {
      columns.push(topic.children[0].checkbox.closest(columnSelector))
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
    this.list.className = 'govuk-miller-columns-selected__list'
    this.appendChild(this.list)
    if (this.millerColumnsElement && this.millerColumnsElement.taxonomy) {
      this.update(this.millerColumnsElement.taxonomy)
    }
  }

  get millerColumnsElement(): ?MillerColumnsElement {
    const millerColumns = document.getElementById(this.getAttribute('for') || '')
    return millerColumns instanceof MillerColumnsElement ? millerColumns : null
  }

  update(taxonomy: Taxonomy) {
    this.taxonomy = taxonomy
    const selectedTopics = taxonomy.selectedTopics
    while (this.list.lastChild) {
      this.list.removeChild(this.list.lastChild)
    }

    if (selectedTopics.length) {
      for (const topic of selectedTopics) {
        this.addSelectedTopic(topic)
      }
    } else {
      const li = document.createElement('li')
      li.className = 'govuk-miller-columns-selected__list-item'
      li.textContent = 'No selected topics'
      this.list.appendChild(li)
    }
  }

  addSelectedTopic(topic: Topic) {
    const li = document.createElement('li')
    li.className = 'govuk-miller-columns-selected__list-item'
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
    button.className = 'govuk-miller-columns-selected__remove-topic'
    button.textContent = 'Remove topic'
    button.addEventListener('click', () => {
      if (this.taxonomy) {
        this.taxonomy.removeTopic(topic)
      }
    })
    return button
  }
}

if (!window.customElements.get('govuk-miller-columns')) {
  window.MillerColumnsElement = MillerColumnsElement
  window.customElements.define('govuk-miller-columns', MillerColumnsElement)
}

if (!window.customElements.get('govuk-miller-columns-selected')) {
  window.MillerColumnsSelectedElement = MillerColumnsSelectedElement
  window.customElements.define('govuk-miller-columns-selected', MillerColumnsSelectedElement)
}

export {MillerColumnsElement, MillerColumnsSelectedElement}
