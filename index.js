/* @flow */

// A list of selected chains
const chains = []

class MillerColumnsElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    // A nested tree list with all items
    const list = this.list

    if (list) {
      // Store checked inputs
      const checkedInputs = this.getCheckedItems()

      // Remove click events for checkboxes and labels
      this.preventClickEvents('input, label')

      // Attach click events for list items
      this.attachClickEvents(list)

      // Unnest the tree list into columns
      this.unnest(list)

      // Mark root elements to know where a breadcrumb starts
      this.setRootElements()

      // If we have checked inputs we reflect their states into list items
      if (checkedInputs) {
        this.loadInputs(checkedInputs)
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

  get breadcrumbs(): ?HTMLDivElement {
    const id = this.getAttribute('breadcrumbs')
    if (!id) return
    const breadcrumbs = document.getElementById(id)
    return breadcrumbs instanceof HTMLDivElement ? breadcrumbs : null
  }

  getCheckedItems(): NodeList<HTMLElement> {
    return this.querySelectorAll('input[type=checkbox]:checked')
  }

  loadInputs(inputs: NodeList<HTMLElement>) {
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
    root.className = 'app-miller-columns__column'
    root.dataset.level = '1'
    queue.push(root)

    while (queue.length) {
      node = queue.shift()

      if (node.children) {
        listItems = node.children

        for (let i = 0; i < listItems.length; i++) {
          const child = listItems[i].querySelector('ul')
          const ancestor = listItems[i]

          if (child) {
            // Store level and depth
            const level = parseInt(node.dataset.level) + 1
            child.dataset.level = level.toString()
            if (level > depth) depth = level

            queue.push(child)

            // Mark list items with child lists as parents.
            if (ancestor) {
              ancestor.dataset.parent = 'true'
              ancestor.className = 'app-miller-columns__item--parent'

              // Expand the requested child node on click.
              const fn = this.toggleColumn.bind(null, this, ancestor, child)
              ancestor.addEventListener('click', fn, false)

              const keys = [' ', 'Enter'] //'ArrowRight'
              ancestor.addEventListener('keydown', this.keydown(fn, keys), false)
            }

            // Hide columns.
            child.dataset.collapse = 'true'
            child.className = 'app-miller-columns__column app-miller-columns__column--collapse'
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

    for (let i = 0; i < items.length; i++) {
      const fn = this.clickItem.bind(null, this, items[i])
      items[i].addEventListener('click', fn, false)

      const keys = [' ', 'Enter'] //'ArrowRight'
      items[i].addEventListener('keydown', this.keydown(fn, keys))

      items[i].tabIndex = 0
    }
  }

  /** Remove click events for checkboxes and labels so they don't interfere. */
  preventClickEvents(selector: string) {
    const items = document.querySelectorAll(selector)

    for (const item of items) {
      item.addEventListener('click', function passiveHandler(event: Event) {
        event.preventDefault()
      })
    }
  }

  // /** Attach key events for lists. */
  // attachKeyEvents(root: HTMLUListElement) {
  //   const items = root.querySelectorAll('li')
  //
  //   for (let i = 0; i < items.length; i++) {
  //     const fn = this.clickItem.bind(null, this, items[i])
  //     items[i].tabIndex = 0
  //   }
  // }

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
    const column = item.closest('ul')
    let sameLevel = false
    if (column) {
      // $FlowFixMe
      const level = millercolumns.getLevel(column).toString()

      if (millercolumns.dataset.current === level) {
        sameLevel = true
      }

      millercolumns.dataset.current = level
    }

    // When starting with a new root item store active chain
    if (
      (item.dataset.root === 'true' || sameLevel) &&
      item.dataset.selected !== 'true' &&
      item.dataset.stored !== 'true'
    ) {
      millercolumns.storeActiveChain()
    }

    // Toggle the state of the item
    if (item.dataset.stored !== 'true') {
      millercolumns.toggleItem(item)
    }

    millercolumns.updateActiveChain()
  }

  /** Toggle list item. */
  toggleItem(item: HTMLElement) {
    if (item.dataset.selected === 'true') {
      this.unselectItem(item)
    } else {
      this.selectItem(item)
    }
  }

  /** Select list item. */
  selectItem(item: HTMLElement) {
    item.dataset.selected = 'true'
    item.classList.add('app-miller-columns__item--selected')

    const input = item.querySelector('input[type=checkbox]')
    if (input) {
      input.setAttribute('checked', 'checked')
    }
  }

  /** Remove list item selection. */
  unselectItem(item: HTMLElement) {
    item.dataset.selected = 'false'
    item.classList.remove('app-miller-columns__item--selected')

    const input = item.querySelector('input[type=checkbox]')
    if (input) {
      input.removeAttribute('checked')
    }
  }

  /** Reveal the column associated with a parent item. */
  toggleColumn(millercolumns: MillerColumnsElement, item: HTMLElement, column: HTMLElement) {
    millercolumns.hideColumns(column.dataset.level)
    millercolumns.resetAnimation(column)
    if (item.dataset.selected === 'true' || item.dataset.stored === 'true') {
      column.dataset.collapse = 'false'
      column.classList.remove('app-miller-columns__column--collapse')
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
      item.classList.add('app-miller-columns__column--collapse')
    }

    millercolumns.updateActiveChain()
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
      millercolumns.unselectItem(item)
    }

    millercolumns.updateActiveChain()
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
        item.classList.add('app-miller-columns__column--narrow')
      }
    }
  }

  /** Reset column width. */
  resetAnimation(column: HTMLElement) {
    const level = this.getLevel(column)
    const depth = this.getDepth()

    if (level < depth) {
      const allLists = this.getAllColumns()
      for (const list of allLists) {
        list.classList.remove('app-miller-columns__column--narrow')
      }
    }
  }

  /** Returns a list of the currently selected items. */
  getActiveChain(): NodeList<HTMLElement> {
    return this.querySelectorAll('.app-miller-columns__column li[data-selected="true"]')
  }

  getActiveChainArray(): Array<HTMLElement> {
    return Array.prototype.slice.call(this.querySelectorAll('.app-miller-columns__column li[data-selected="true"]'))
  }

  /** Returns a list of all columns. */
  getAllColumns(): NodeList<HTMLElement> {
    return this.querySelectorAll('.app-miller-columns__column')
  }

  /** Returns the level of a column. */
  getLevel(column: HTMLElement): number {
    return parseInt(column.dataset.level)
  }

  /** Returns the maximum depth of the miller column. */
  getDepth(): number {
    return parseInt(this.dataset.depth)
  }

  /** Set all items on level 1 as root elements. */
  setRootElements() {
    const items = this.querySelectorAll('[data-level="1"] li')

    for (const item of items) {
      item.dataset.root = 'true'
    }
  }

  /** Store active items as a NodeList in a chain array. */
  storeActiveChain() {
    const chain = this.getActiveChainArray()

    // Store the current chain in a list
    chains.push(chain)

    // Convert selected items to stored items
    for (const item of chain) {
      item.dataset.selected = 'false'
      item.classList.remove('app-miller-columns__item--selected')

      item.dataset.stored = 'true'
      item.classList.add('app-miller-columns__item--stored')
    }
  }

  /** Remove a NodeList from the chain array. */
  removeStoredChain(chain: Array<HTMLElement>) {
    for (const item of chain) {
      this.unselectItem(item)

      item.dataset.stored = 'false'
      item.classList.remove('app-miller-columns__item--stored')
    }
  }

  /** Update active items in the current chain. */
  updateActiveChain() {
    const chain = this.getActiveChainArray()

    // Store the current chain in a list
    if (chains[chains.length - 1]) {
      chains[chains.length - 1] = chain
    } else {
      chains.push(chain)
    }
    this.updateBreadcrumbs()
  }

  /** Update the selected breadcrumbs. */
  updateBreadcrumbs() {
    const breadcrumbs = this.breadcrumbs
    if (breadcrumbs && chains) {
      breadcrumbs.innerHTML = ''
      for (const [index, chainItem] of chains.entries()) {
        if (chainItem.length) {
          const chainElement = document.createElement('ol')
          chainElement.classList.add('govuk-breadcrumbs__list')
          this.updateChain(chainElement, chainItem)

          // Add a remove link to the chainElement
          const removeButton = document.createElement('button')
          removeButton.dataset.chain = index.toString()
          removeButton.classList.add('govuk-link')
          removeButton.innerHTML = 'Remove topic'
          const fn = this.removeChain.bind(null, this, removeButton)
          removeButton.addEventListener('click', fn, false)

          chainElement.appendChild(removeButton)

          breadcrumbs.appendChild(chainElement)
        }
      }
    }
  }

  /** Update a breadcrumbs. */
  updateChain(chainElement: HTMLElement, chain: Array<HTMLElement>) {
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
  removeChain(millercolumns: MillerColumnsElement, item: HTMLElement) {
    const chainIndex = parseInt(item.dataset.chain)
    millercolumns.removeStoredChain(chains[chainIndex])
    chains.splice(chainIndex, 1)

    // If active chain store chain and hide columns
    if (chainIndex === chains.length) {
      millercolumns.storeActiveChain()
      millercolumns.hideColumns('2')
    }

    millercolumns.updateBreadcrumbs()
  }
}

if (!window.customElements.get('govuk-miller-columns')) {
  window.MillerColumnsElement = MillerColumnsElement
  window.customElements.define('govuk-miller-columns', MillerColumnsElement)
}

export default MillerColumnsElement
