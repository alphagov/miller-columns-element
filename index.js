/* @flow */

class MillerColumnsElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    // A nested tree list with all items
    const list = this.list

    if (list) {
      // Store checked inputs
      const checkboxes = this.checkboxes
      const breadcrumbs = this.breadcrumbs

      // Attach click events for list items
      this.attachClickEvents(list)

      // Unnest the tree list into columns
      this.unnest(list)

      // If we have checked inputs we reflect their states into list items
      if (checkboxes && breadcrumbs) {
        this.loadCheckboxes(checkboxes)
      }
    }
  }

  disconnectedCallback() {}

  get list(): ?HTMLUListElement {
    const id = this.getAttribute('for')
    if (!id) return
    const list = document.getElementById(id)
    return list instanceof HTMLUListElement ? list : null
  }

  get breadcrumbs(): ?BreadcrumbsElement {
    const id = this.getAttribute('breadcrumbs')
    if (!id) return
    const breadcrumbs = document.getElementById(id)
    return breadcrumbs instanceof BreadcrumbsElement ? breadcrumbs : null
  }

  get checkboxes(): Array<HTMLElement> {
    return Array.prototype.slice.call(this.querySelectorAll('input[type=checkbox]:checked'))
  }

  loadCheckboxes(inputs: Array<HTMLElement>) {
    for (const input of inputs) {
      const li = input.closest('li')
      if (li) {
        li.dispatchEvent(new MouseEvent('click'))
      }
    }
  }

  /** Convert nested lists into columns using breadth-first traversal. */
  unnest(root: HTMLUListElement) {
    const millercolumns = this

    const queue = []
    let node
    let listItems
    let depth = 1

    // Push the root unordered list item into the queue.
    root.className = 'govuk-miller-columns__column'
    root.dataset.level = '1'
    queue.push(root)

    while (queue.length) {
      node = queue.shift()

      if (node.children) {
        listItems = node.children

        for (const listItem of listItems) {
          const child = listItem.querySelector('ul')
          const ancestor = listItem

          if (child) {
            // Store level and depth
            const level = parseInt(node.dataset.level) + 1
            child.dataset.level = level.toString()
            if (level > depth) depth = level

            queue.push(child)

            // Mark list items with child lists as parents.
            if (ancestor) {
              ancestor.dataset.parent = 'true'
              ancestor.className = 'govuk-miller-columns__item--parent'

              // Expand the requested child node on click.
              const fn = this.toggleColumn.bind(null, this, ancestor, child)
              ancestor.addEventListener('click', fn, false)

              const keys = [' ', 'Enter']
              ancestor.addEventListener('keydown', this.keydown(fn, keys), false)
            }

            // Hide columns.
            child.dataset.collapse = 'true'
            child.className = 'govuk-miller-columns__column govuk-miller-columns__column--collapse'
            // Causes item siblings to have a flattened DOM lineage.
            millercolumns.insertAdjacentElement('beforeend', child)
          }
        }
      }
    }

    this.dataset.depth = depth.toString()
  }

  /** Attach click events for list items. */
  attachClickEvents(root: HTMLUListElement) {
    const items = root.querySelectorAll('li')

    for (const item of items) {
      const fn = this.clickItem.bind(null, this, item)
      item.addEventListener('click', fn, false)

      const keys = [' ', 'Enter']
      item.addEventListener('keydown', this.keydown(fn, keys))

      item.tabIndex = 0
    }
  }

  /** Attach key events for lists. */
  keydown(fn: Function, keys: Array<string>): Function {
    return function(event: KeyboardEvent) {
      if (keys.indexOf(event.key) >= 0) {
        event.preventDefault()
        fn(event)
      }
    }
  }

  /** Click list item. */
  clickItem(millercolumns: MillerColumnsElement, item: HTMLElement) {
    // Set the current level
    const level = millercolumns.getItemLevel(item)

    millercolumns.dataset.current = level

    // When starting with a new root item store active chain
    if (
      millercolumns.breadcrumbs &&
      level === '1' &&
      item.dataset.selected !== 'true' &&
      item.dataset.stored !== 'true'
    ) {
      millercolumns.breadcrumbs.storeActiveChain()
    }

    // Toggle the state of the item
    millercolumns.toggleItem(item)

    if (millercolumns.breadcrumbs) {
      millercolumns.breadcrumbs.updateActiveChain()
    }
  }

  /** Toggle list item. */
  toggleItem(item: HTMLElement) {
    if (item.dataset.selected === 'true') {
      this.deselectItem(item)
    } else {
      this.selectItem(item)
    }
  }

  /** Select list item. */
  selectItem(item: HTMLElement) {
    item.dataset.selected = 'true'
    item.classList.add('govuk-miller-columns__item--selected')

    const input = item.querySelector('input[type=checkbox]')
    if (input) {
      input.setAttribute('checked', 'checked')
    }
  }

  /** Remove list item selection. */
  deselectItem(item: HTMLElement) {
    item.dataset.selected = 'false'
    item.dataset.stored = 'false'
    item.classList.remove('govuk-miller-columns__item--selected')
    item.classList.remove('govuk-miller-columns__item--stored')

    const input = item.querySelector('input[type=checkbox]')
    if (input) {
      input.removeAttribute('checked')
    }
  }

  /** Reveal the column associated with a parent item. */
  toggleColumn(millercolumns: MillerColumnsElement, item: HTMLElement, column: HTMLElement) {
    millercolumns.hideColumns(column.dataset.level)
    if (item.dataset.selected === 'true' || item.dataset.stored === 'true') {
      column.dataset.collapse = 'false'
      column.classList.remove('govuk-miller-columns__column--collapse')
      millercolumns.animateColumns(column)
    } else {
      // Ensure children are removed
      millercolumns.removeAllChildren(column.dataset.level)
    }
  }

  /** Hides all columns at a higher or equal level with the specified one. */
  hideColumns(level: string) {
    const millercolumns = this
    const levelInt = parseInt(level)
    const depth = this.getDepth()
    const columnSelectors = []

    for (let i = levelInt; i <= depth; i++) {
      columnSelectors.push(`[data-level='${i.toString()}']`)
    }

    const lists = millercolumns.querySelectorAll(columnSelectors.join(', '))
    for (const item of lists) {
      item.dataset.collapse = 'true'
      item.classList.add('govuk-miller-columns__column--collapse')
    }

    this.resetAnimation(levelInt)
  }

  /** Remove selections at a higher or equal level with the specified one. */
  removeAllChildren(level: string) {
    const millercolumns = this
    const levelInt = parseInt(level)
    const depth = this.getDepth()
    const itemSelectors = []

    for (let i = levelInt; i <= depth; i++) {
      itemSelectors.push(`[data-level='${i.toString()}'] li`)
    }

    const items = millercolumns.querySelectorAll(itemSelectors.join(', '))
    for (const item of items) {
      millercolumns.deselectItem(item)
    }

    if (millercolumns.breadcrumbs) {
      millercolumns.breadcrumbs.updateActiveChain()
    }
  }

  /** Ensure the viewport shows the entire newly expanded item. */
  animateColumns(column: HTMLElement) {
    const millercolumns = this
    const level = this.getLevel(column)
    const depth = this.getDepth()

    if (level >= depth - 1) {
      const selectors = []

      for (let i = 1; i < level; i++) {
        selectors.push(`[data-level='${i.toString()}']`)
      }

      const lists = millercolumns.querySelectorAll(selectors.join(', '))
      for (const item of lists) {
        item.classList.add('govuk-miller-columns__column--narrow')
      }
    }
  }

  /** Reset column width. */
  resetAnimation(level: number) {
    const depth = this.getDepth()

    if (level < depth) {
      const allLists = this.getAllColumns()
      for (const list of allLists) {
        list.classList.remove('govuk-miller-columns__column--narrow')
      }
    }
  }

  // Return the level of an element
  getItemLevel(item: HTMLElement): string {
    const column = item.closest('ul')
    // $FlowFixMe
    return this.getLevel(column).toString()
  }

  /** Returns a list of the currently selected items. */
  getActiveChain(): Array<HTMLElement> {
    return Array.prototype.slice.call(this.querySelectorAll('.govuk-miller-columns__column li[data-selected="true"]'))
  }

  /** Returns a list of all columns. */
  getAllColumns(): Array<HTMLElement> {
    return Array.prototype.slice.call(this.querySelectorAll('.govuk-miller-columns__column'))
  }

  /** Returns the level of a column. */
  getLevel(column: HTMLElement): number {
    return parseInt(column.dataset.level)
  }

  /** Returns the maximum depth of the miller column. */
  getDepth(): number {
    return parseInt(this.dataset.depth)
  }
}

// A list of selected chains
const chains = []

class BreadcrumbsElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    // const millercolumns = this.millercolumns
    // const chain = this.chain
    if (this.millercolumns) {
      this.millercolumns.loadCheckboxes(this.millercolumns.checkboxes)
    }
    this.renderChains()
  }

  disconnectedCallback() {}

  get millercolumns(): ?MillerColumnsElement {
    const id = this.getAttribute('for')
    if (!id) return
    const millercolumns = document.getElementById(id)
    if (!(millercolumns instanceof MillerColumnsElement)) return
    return millercolumns instanceof MillerColumnsElement ? millercolumns : null
  }

  get chain(): ?Array<HTMLElement> {
    if (!this.millercolumns) return
    else return this.millercolumns.getActiveChain()
  }

  // /** Store active items in a chain array. */
  storeActiveChain() {
    // Store the current chain in a list
    chains.push(this.chain)

    // Convert selected items to stored items
    if (Array.isArray(this.chain)) {
      for (const item of this.chain) {
        item.dataset.selected = 'false'
        item.classList.remove('govuk-miller-columns__item--selected')

        item.dataset.stored = 'true'
        item.classList.add('govuk-miller-columns__item--stored')
      }
    }
  }

  /** Update active items in the current chain. */
  updateActiveChain() {
    // Store the current chain in a list
    if (chains[chains.length - 1]) {
      chains[chains.length - 1] = this.chain
    } else {
      chains.push(this.chain)
    }

    // If empty chain remove it from the array
    // $FlowFixMe
    if (chains[chains.length - 1].length === 0) {
      this.removeChain(this, chains.length - 1)
    }

    this.renderChains()
  }

  /** Update the breadcrumbs element. */
  renderChains() {
    if (chains.length) {
      this.innerHTML = ''
      for (const [index, chainItem] of chains.entries()) {
        if (chainItem) {
          this.addChain(chainItem, index)
        }
      }
    } else {
      this.innerHTML = 'No selected topics'
    }
  }

  /** Add a breadcrumbs. */
  addChain(chain: Array<HTMLElement>, index: number) {
    const chainElement = document.createElement('ol')
    chainElement.classList.add('govuk-breadcrumbs__list')
    chainElement.dataset.chain = index.toString()
    this.updateChain(chainElement, chain)

    // Add a remove link to the chainElement
    const removeButton = document.createElement('button')
    removeButton.dataset.chain = index.toString()
    removeButton.classList.add('govuk-link')
    removeButton.innerHTML = 'Remove topic'
    const fn = this.removeChain.bind(null, this, index)
    removeButton.addEventListener('click', fn, false)

    chainElement.appendChild(removeButton)

    this.appendChild(chainElement)
  }

  /** Update a breadcrumbs. */
  updateChain(chainElement: HTMLOListElement, chain: Array<HTMLElement>) {
    chainElement.innerHTML = ''
    for (const item of chain) {
      const breadcrumb = document.createElement('li')

      const label = item.querySelector('label')
      if (label) {
        breadcrumb.innerHTML = label.innerHTML
      } else {
        breadcrumb.innerHTML = item.innerHTML
      }

      breadcrumb.classList.add('govuk-breadcrumbs__list-item')
      chainElement.appendChild(breadcrumb)
    }
  }

  /** Remove a breadcrumbs. */
  removeChain(breadcrumbs: BreadcrumbsElement, chainIndex) {
    if (Array.isArray(chains[chainIndex])) {
      breadcrumbs.removeStoredChain(chains[chainIndex])

      chains.splice(chainIndex, 1)

      // If active chain hide revealed columns
      if (chainIndex === chains.length) {
        if (breadcrumbs.millercolumns) {
          breadcrumbs.millercolumns.hideColumns('2')
        }
      }

      breadcrumbs.renderChains()
    }
  }

  /** Remove a chain of stored items from the Miller Columns. */
  removeStoredChain(chain: Array<HTMLElement>) {
    for (const item of chain) {
      if (this.millercolumns) {
        this.millercolumns.deselectItem(item)
        item.dataset.stored = 'false'
        item.classList.remove('govuk-miller-columns__item--stored')
      }
    }
  }
}

if (!window.customElements.get('govuk-miller-columns')) {
  window.MillerColumnsElement = MillerColumnsElement
  window.customElements.define('govuk-miller-columns', MillerColumnsElement)
}

if (!window.customElements.get('govuk-breadcrumbs')) {
  window.BreadcrumbsElement = BreadcrumbsElement
  window.customElements.define('govuk-breadcrumbs', BreadcrumbsElement)
}

export default MillerColumnsElement
