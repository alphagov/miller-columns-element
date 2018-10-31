/* @flow */

class MillerColumnsElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const list = this.list
    // const breadcrumbs = this.breadcrumbs
    if (list) {
      this.attachClickEvents(list)
      this.unnest(list)
      // this.updateBreadcrumbs(breadcrumbs)
    }
  }

  disconnectedCallback() {}

  get list(): ?HTMLUListElement {
    const id = this.getAttribute('for')
    if (!id) return
    const list = document.getElementById(id)
    return list instanceof HTMLUListElement ? list : null
  }

  get breadcrumbs(): ?HTMLOListElement {
    const id = this.getAttribute('breadcrumbs')
    if (!id) return
    const breadcrumbs = document.getElementById(id)
    return breadcrumbs instanceof HTMLOListElement ? breadcrumbs : null
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
              ancestor.dataset['parent'] = 'true'
              ancestor.className = 'app-miller-columns__item--parent'

              // Expand the requested child node on click.
              const fn = this.revealColumn.bind(null, this, ancestor, child)
              ancestor.addEventListener('click', fn, false)
            }

            // Hide columns.
            child.className = 'app-miller-columns__column app-miller-columns__column--collapse'
            // Causes item siblings to have a flattened DOM lineage.
            millercolumns.insertAdjacentElement('beforeend', child)
          }
        }
      }
    }

    root.dataset['depth'] = depth.toString()
  }

  /** Attach click events for list items. */
  attachClickEvents(root: HTMLUListElement) {
    const items = root.querySelectorAll('li')

    for (let i = 0; i < items.length; i++) {
      const fn = this.selectItem.bind(null, this, items[i])
      items[i].addEventListener('click', fn, false)
    }
  }

  /** Select item. */
  selectItem(millercolumns: MillerColumnsElement, item: HTMLElement) {
    item.classList.toggle('app-miller-columns__item--selected')

    millercolumns.updateBreadcrumbs(millercolumns)
  }

  /** Reveal the column associated with a parent item. */
  revealColumn(millercolumns: MillerColumnsElement, item: HTMLElement, column: HTMLElement) {
    millercolumns.hideColumns(millercolumns, column.dataset.level)
    if (item.classList.contains('app-miller-columns__item--selected')) {
      column.classList.remove('app-miller-columns__column--collapse')
    }
  }

  /** Hides all columns at a higher or equal level with the specified one. */
  hideColumns(millercolumns: MillerColumnsElement, level: string) {
    const levelInt = parseInt(level)
    const selectors = []

    // TODO: use depth instead of constant
    for (let i = levelInt; i <= 5; i++) {
      selectors.push(`[data-level='${i.toString()}']`)
    }

    const lists = millercolumns.querySelectorAll(selectors.join(', '))
    for (const item of lists) {
      item.classList.add('app-miller-columns__column--collapse')
    }
  }

  /** Add the breadcrumb path using the chain of selected items. */
  updateBreadcrumbs(millercolumns: MillerColumnsElement) {
    const chain = this.getActiveChain(millercolumns)
    const breadcrumbs = millercolumns.breadcrumbs

    if (breadcrumbs) {
      breadcrumbs.innerHTML = ''

      for (const item of chain) {
        const breadcrumb = document.createElement('li')
        breadcrumb.innerHTML = item.innerHTML
        breadcrumb.classList.add('govuk-breadcrumbs__list-item')
        breadcrumbs.appendChild(breadcrumb)
      }
    }
  }

  /** Returns a list of the currently selected items. */
  getActiveChain(millercolumns: MillerColumnsElement) {
    return millercolumns.querySelectorAll('.app-miller-columns__item--selected')
  }
}

if (!window.customElements.get('govuk-miller-columns')) {
  window.MillerColumnsElement = MillerColumnsElement
  window.customElements.define('govuk-miller-columns', MillerColumnsElement)
}

export default MillerColumnsElement
