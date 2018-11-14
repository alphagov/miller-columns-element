/* @flow */

class MillerColumnsElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    // A nested tree list with all items
    const list = this.list

    // Set default values
    this.dataset.chain = '0'
    this.dataset.depth = '0'
    this.dataset.level = '0'

    // Show the columns
    this.style.display = 'block'

    if (list) {
      // Store checked inputs
      const checkboxes = this.checkboxes

      // Attach click events for list items
      this.attachClickEvents(list)

      // Load checkbox ids as data-id for list items
      if (checkboxes) {
        this.loadIds(checkboxes)
      }

      // Unnest the tree list into columns
      this.unnest(list)
    }
  }

  disconnectedCallback() {}

  /** Returns the associated nested list of items. */
  get list(): ?HTMLUListElement {
    const id = this.getAttribute('for')
    if (!id) return
    const list = document.getElementById(id)
    return list instanceof HTMLUListElement ? list : null
  }

  /** Returns the associated breadcrumbs element. */
  get breadcrumbs(): ?BreadcrumbsElement {
    const id = this.getAttribute('breadcrumbs')
    if (!id) return
    const breadcrumbs = document.getElementById(id)
    return breadcrumbs instanceof BreadcrumbsElement ? breadcrumbs : null
  }

  /** Returns a list of all selected checkboxes for initialisation. */
  get selectedCheckboxes(): Array<HTMLElement> {
    return Array.prototype.slice.call(this.querySelectorAll('input[type=checkbox]:checked'))
  }

  /** Returns a list of all checkboxes. */
  get checkboxes(): Array<HTMLElement> {
    return Array.prototype.slice.call(this.querySelectorAll('input[type=checkbox]'))
  }

  /** Returns a list of the currently selected items. */
  get activeChain(): Array<HTMLElement> {
    return Array.prototype.slice.call(
      this.querySelectorAll(`.govuk-miller-columns__column li[data-chain="${this.dataset.chain}"]`)
    )
  }

  /** Returns the index of the active chain item. */
  get activeChainIndex(): number {
    // $FlowFixMe
    return parseInt(this.dataset.chain)
  }

  /** Returns the maximum depth of the miller column. */
  get depth(): number {
    return parseInt(this.dataset.depth)
  }

  // Return the level of an element
  getItemLevel(item: HTMLElement): string {
    const column = item.closest('ul')
    let level = '0'
    if (column instanceof HTMLUListElement) {
      level = this.getLevel(column).toString()
    }
    return level
  }

  getItemParent(item: HTMLElement): ?HTMLElement {
    const column = item.closest('ul')
    // $FlowFixMe
    const parent = document.querySelector(`[data-id="${column.dataset.parent}"]`)
    return parent
  }

  /** Returns a list of items from the same chain. */
  getChain(chain: string): Array<HTMLElement> {
    return Array.prototype.slice.call(this.querySelectorAll(`.govuk-miller-columns__column li[data-chain="${chain}"]`))
  }

  /** Returns a list of selected items from a column/level. */
  getSelectedItems(level: string): Array<HTMLElement> {
    return Array.prototype.slice.call(
      this.querySelectorAll(`.govuk-miller-columns__column[data-level="${level}"] li[data-selected="true"]`)
    )
  }

  /** Returns a list of ancestors for a specified item. */
  getAncestors(item: ?HTMLElement): Array<HTMLElement> {
    const ancestors = []
    // item = this.getItemParent(item)
    while (item) {
      if (item instanceof HTMLElement) {
        ancestors.push(item)
        item = this.getItemParent(item)
      }
    }
    return ancestors.reverse()
  }

  /** Returns a list of all columns. */
  getAllColumns(): Array<HTMLElement> {
    return Array.prototype.slice.call(this.querySelectorAll('.govuk-miller-columns__column'))
  }

  /** Returns the level of a column. */
  getLevel(column: HTMLElement): number {
    return parseInt(column.dataset.level)
  }

  /** Click list items with checkedboxes. */
  loadCheckboxes(inputs: Array<HTMLElement>) {
    for (const input of inputs) {
      const li = input.closest('li')
      if (li instanceof HTMLLIElement) {
        li.dispatchEvent(new MouseEvent('click'))
        if (this.breadcrumbs) {
          this.breadcrumbs.storeActiveChain()
          this.dataset.chain = (chains.length + 1).toString()
        }
      }
    }
  }

  /** Load checkboxes ids to list items so we can use them determine ancestors. */
  loadIds(inputs: Array<HTMLElement>) {
    for (const input of inputs) {
      const li = input.closest('li')
      if (li instanceof HTMLLIElement) {
        li.dataset.id = input.id
        li.classList.add('govuk-miller-columns__item')
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
          const descendants = listItem.querySelector('ul')
          const ancestor = listItem

          if (descendants) {
            // Store level and depth.
            const level = parseInt(node.dataset.level) + 1
            descendants.dataset.level = level.toString()
            if (level > depth) depth = level

            queue.push(descendants)

            if (ancestor) {
              // Mark list items with descendants as parents.
              ancestor.dataset.parent = 'true'
              ancestor.classList.add('govuk-miller-columns__item--parent')

              // Expand the descendants list on click.
              const fn = this.toggleColumn.bind(null, this, ancestor, descendants)
              ancestor.addEventListener('click', fn, false)

              // Attach event listeners.
              const keys = [' ', 'Enter']
              ancestor.addEventListener('keydown', this.keydown(fn, keys), false)
            }

            // Hide columns.
            descendants.dataset.collapse = 'true'
            descendants.dataset.parent = ancestor.dataset.id
            descendants.className = 'govuk-miller-columns__column govuk-miller-columns__column--collapse'
            // Causes item siblings to have a flattened DOM lineage.
            millercolumns.insertAdjacentElement('beforeend', descendants)
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
    const currentLevel = millercolumns.getItemLevel(item)
    const previousLevel = millercolumns.dataset.level

    // Determine existing selections on the column
    const selectedItems = millercolumns.getSelectedItems(currentLevel)

    millercolumns.dataset.level = currentLevel

    if (!(millercolumns.breadcrumbs instanceof BreadcrumbsElement)) return

    if (
      // If selecting an upper level or a new item on the same level
      // and not selected nor stored we start a new chain
      (currentLevel < previousLevel || selectedItems.length > 0) &&
      item.dataset.selected !== 'true' &&
      item.dataset.stored !== 'true'
    ) {
      if (currentLevel < previousLevel || selectedItems.length > 0) {
        // Store active chain
        millercolumns.breadcrumbs.storeActiveChain()
        // Increment chain index
        millercolumns.dataset.chain = chains.length.toString()
        // Default item click
        item.dataset.chain = millercolumns.dataset.chain

        const ancestors = millercolumns.getAncestors(item)
        if (ancestors) {
          millercolumns.selectItems(ancestors, item.dataset.chain)
        }
      } else {
        // Store active chain
        millercolumns.breadcrumbs.storeActiveChain()
        // Increment chain index
        millercolumns.dataset.chain = chains.length.toString()
        // Default item click
        item.dataset.chain = millercolumns.dataset.chain
        // Toggle the state of the item
        millercolumns.toggleItem(item)
      }
    } else if (item.dataset.stored === 'true') {
      // If click on a stored item we swap the active chain and not toggle
      millercolumns.breadcrumbs.storeActiveChain()
      millercolumns.dataset.chain = item.dataset.chain
      // $FlowFixMe
      millercolumns.breadcrumbs.swapActiveChain()
    } else {
      // Default item click
      item.dataset.chain = millercolumns.dataset.chain

      if (item.dataset.selected !== 'true' && item.dataset.stored !== 'true') {
        const ancestors = millercolumns.getAncestors(item)
        if (ancestors) {
          millercolumns.selectItems(ancestors, item.dataset.chain)
        }
      } else {
        // Toggle the state of the item
        millercolumns.toggleItem(item)
      }
    }

    // If not a parent hide descendant lists
    if (item.dataset.parent !== 'true') {
      millercolumns.hideColumns((parseInt(currentLevel) + 1).toString())
    }

    millercolumns.breadcrumbs.updateActiveChain()
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

  /** Select a list of items. */
  selectItems(items: Array<HTMLElement>, index: string) {
    for (const item of items) {
      this.selectItem(item)
      item.dataset.chain = index
    }
  }

  /** Remove list item selection. */
  deselectItem(item: HTMLElement) {
    item.dataset.selected = 'false'
    item.dataset.stored = 'false'
    item.removeAttribute('data-chain')
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
    const levelInt = parseInt(level)
    const depth = this.depth
    const columnSelectors = []

    for (let i = levelInt; i <= depth; i++) {
      columnSelectors.push(`[data-level='${i.toString()}']`)
    }

    const lists = this.querySelectorAll(columnSelectors.join(', '))
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
    const depth = this.depth
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
    const depth = this.depth

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
    const depth = this.depth

    if (level < depth) {
      const allLists = this.getAllColumns()
      for (const list of allLists) {
        list.classList.remove('govuk-miller-columns__column--narrow')
      }
    }
  }
}

// A list of selected chains
const chains = []

class BreadcrumbsElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    if (this.millercolumns) {
      this.millercolumns.loadCheckboxes(this.millercolumns.selectedCheckboxes)
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
    return this.millercolumns.activeChain
  }

  /** Store active items in a chain array. */
  storeActiveChain() {
    // Store the current chain in a list
    if (this.millercolumns) {
      const index = this.millercolumns.activeChainIndex
      if (index && this.chain) {
        chains[index] = this.chain
      }
    }

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

  /** Swap selected items with stored items in a chain array. */
  swapActiveChain() {
    // Convert stored items into selected items
    if (Array.isArray(this.chain)) {
      for (const item of this.chain) {
        item.dataset.selected = 'true'
        item.classList.add('govuk-miller-columns__item--selected')

        item.dataset.stored = 'false'
        item.classList.remove('govuk-miller-columns__item--stored')
      }
    }
  }

  /** Update active items in the current chain. */
  updateActiveChain() {
    if (this.millercolumns) {
      const index = this.millercolumns.activeChainIndex

      // Store the current chain in a list
      if (this.chain) {
        chains[index] = this.chain
      }

      // If empty chain remove it from the array
      // $FlowFixMe
      if (chains[index].length === 0) {
        this.removeChain(this, index)
      }
    }

    this.renderChains()
  }

  /** Update the breadcrumbs element. */
  renderChains() {
    if (chains.length) {
      this.innerHTML = ''
      for (const [index, chainItem] of chains.entries()) {
        // $FlowFixMe
        if (chainItem && chainItem.length) {
          // $FlowFixMe
          this.addChain(chainItem, index)
        }
      }
    } else {
      this.innerHTML = `
      <ol class="govuk-breadcrumbs__list">
        <li class="govuk-breadcrumbs__list-item">No selected topics</li>
      </ol>`
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
