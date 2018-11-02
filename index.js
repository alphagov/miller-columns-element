/* @flow */

const chains = []

class MillerColumnsElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const list = this.list
    if (list) {
      this.attachClickEvents(list)
      this.unnest(list)
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

              if (level === 2) ancestor.dataset.root = 'true'

              // Expand the requested child node on click.
              const fn = this.revealColumn.bind(null, this, ancestor, child)
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
      const fn = this.selectItem.bind(null, this, items[i])
      items[i].addEventListener('click', fn, false)

      const keys = [' ', 'Enter'] //'ArrowRight'
      items[i].addEventListener('keydown', this.keydown(fn, keys))

      items[i].tabIndex = 0
    }
  }

  // /** Attach key events for lists. */
  // attachKeyEvents(root: HTMLUListElement) {
  //   const items = root.querySelectorAll('li')
  //
  //   for (let i = 0; i < items.length; i++) {
  //     const fn = this.selectItem.bind(null, this, items[i])
  //     items[i].tabIndex = 0
  //   }
  // }

  keydown(fn: Function, keys: Array<string>) {
    return function(event: KeyboardEvent) {
      if (keys.indexOf(event.key) >= 0) {
        event.preventDefault()
        fn(event)
      }
    }
  }

  /** Select item. */
  selectItem(millercolumns: MillerColumnsElement, item: HTMLElement) {
    // Store active chain
    // TODO: if the item is a sibling of the last selection, skip update active chain
    if (item.dataset.root === 'true' && item.dataset.selected !== 'true') {
      millercolumns.storeActiveChain()
    }

    item.dataset.selected = item.dataset.selected === 'true' ? 'false' : 'true'
    item.classList.toggle('app-miller-columns__item--selected')

    // TODO: ensure parents are selected

    millercolumns.updateActiveChain()
  }

  /** Reveal the column associated with a parent item. */
  revealColumn(millercolumns: MillerColumnsElement, item: HTMLElement, column: HTMLElement) {
    // Hide columns and remove selections
    millercolumns.hideColumns(millercolumns, column.dataset.level)
    millercolumns.resetAnimation(millercolumns, column)
    if (item.dataset.selected === 'true') {
      column.dataset.collapse = 'false'
      column.classList.remove('app-miller-columns__column--collapse')
      millercolumns.animateColumns(millercolumns, column)
    }
  }

  /** Hides all columns at a higher or equal level with the specified one. */
  /** Remove selections at a higher or equal level with the specified one. */
  hideColumns(millercolumns: MillerColumnsElement, level: string) {
    const levelInt = parseInt(level)
    const columnSelectors = []
    const itemSelectors = []

    for (let i = levelInt; i <= parseInt(millercolumns.dataset.depth); i++) {
      columnSelectors.push(`[data-level='${i.toString()}']`)
      itemSelectors.push(`[data-level='${i.toString()}'] li`)
    }

    const lists = millercolumns.querySelectorAll(columnSelectors.join(', '))
    for (const item of lists) {
      item.dataset.collapse = 'true'
      item.classList.add('app-miller-columns__column--collapse')
    }

    const items = millercolumns.querySelectorAll(itemSelectors.join(', '))
    for (const item of items) {
      item.dataset.selected = 'false'
      item.classList.remove('app-miller-columns__item--selected')
    }

    millercolumns.updateActiveChain()
  }

  /** Add the breadcrumb path using the chain of selected items. */
  updateBreadcrumbs() {
    const breadcrumbs = document.querySelector('.govuk-breadcrumbs')
    if (breadcrumbs && chains) {
      breadcrumbs.innerHTML = ''
      for (const chainItem of chains) {
        const chainElement = document.createElement('ol')
        chainElement.classList.add('govuk-breadcrumbs__list')
        // TODO: add a remove link to the chainElement
        this.updateChain(chainElement, chainItem)
        breadcrumbs.appendChild(chainElement)
      }
    }
  }

  updateChain(chainElement: HTMLElement, chain: NodeList<HTMLElement>) {
    chainElement.innerHTML = ''
    for (const item of chain) {
      const breadcrumb = document.createElement('li')
      breadcrumb.innerHTML = item.innerHTML
      breadcrumb.classList.add('govuk-breadcrumbs__list-item')
      chainElement.appendChild(breadcrumb)
    }
  }

  /** Ensure the viewport shows the entire newly expanded item. */
  animateColumns(millercolumns: MillerColumnsElement, column: HTMLElement) {
    const level = column.dataset.level
    const levelInt = parseInt(level)

    if (levelInt >= parseInt(millercolumns.dataset.depth) - 1) {
      const selectors = []

      for (let i = 1; i < levelInt; i++) {
        selectors.push(`[data-level='${i.toString()}']`)
      }

      const lists = millercolumns.querySelectorAll(selectors.join(', '))
      for (const item of lists) {
        item.classList.add('app-miller-columns__column--narrow')
      }
    }
  }

  /** Reset column width. */
  resetAnimation(millercolumns: MillerColumnsElement, column: HTMLElement) {
    const level = column.dataset.level
    const levelInt = parseInt(level)

    if (levelInt < parseInt(millercolumns.dataset.depth)) {
      const allLists = millercolumns.querySelectorAll('.app-miller-columns__column')
      for (const list of allLists) {
        list.classList.remove('app-miller-columns__column--narrow')
      }
    }
  }

  /** Returns a list of the currently selected items. */
  getActiveChain(millercolumns: MillerColumnsElement) {
    return millercolumns.querySelectorAll('.app-miller-columns__column li[data-selected="true"]')
  }

  /** Returns a list of the currently selected items. */
  storeActiveChain() {
    const chain = document.querySelectorAll('.app-miller-columns__column li[data-selected="true"]')

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

  updateActiveChain() {
    const chain = document.querySelectorAll('.app-miller-columns__column li[data-selected="true"]')

    // Store the current chain in a list
    if (chains[chains.length - 1]) {
      chains[chains.length - 1] = chain
    } else {
      chains.push(chain)
    }
    this.updateBreadcrumbs()
  }
}

if (!window.customElements.get('govuk-miller-columns')) {
  window.MillerColumnsElement = MillerColumnsElement
  window.customElements.define('govuk-miller-columns', MillerColumnsElement)
}

export default MillerColumnsElement
