/* @flow */

class MillerColumnsElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const list = this.list
    if (list) {
      attachClickEvents(list)
      unnest(list)
    }
  }

  disconnectedCallback() {}

  get list(): ?HTMLUListElement {
    const id = this.getAttribute('for')
    if (!id) return
    const list = document.getElementById(id)
    return list instanceof HTMLUListElement ? list : null
  }
}

/** Convert nested lists into columns using breadth-first traversal. */
function unnest(root: HTMLUListElement) {
  const millercolumns = root.closest('govuk-miller-columns')
  if (!(millercolumns instanceof MillerColumnsElement)) return

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
            const fn = revealColumn.bind(null, ancestor, child)
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

function attachClickEvents(root: HTMLUListElement) {
  const items = root.querySelectorAll('li')

  for (let i = 0; i < items.length; i++) {
    const fn = selectItem.bind(null, items[i])
    items[i].addEventListener('click', fn, false)
  }
}

function selectItem(item: HTMLElement) {
  item.classList.toggle('app-miller-columns__item--selected')
}

function revealColumn(item: HTMLElement, column: HTMLElement) {
  hideColumns(column.dataset.level)
  if (item.classList.contains('app-miller-columns__item--selected')) {
    column.classList.remove('app-miller-columns__column--collapse')
  }
}

function hideColumns(level) {
  const levelInt = parseInt(level)
  const selectors = []

  for (let i = levelInt; i <= 5; i++) {
    selectors.push(`[data-level='${i.toString()}']`)
  }

  const lists = document.querySelectorAll(selectors.join(', '))
  for (const item of lists) {
    item.classList.add('app-miller-columns__column--collapse')
  }
}

if (!window.customElements.get('govuk-miller-columns')) {
  window.MillerColumnsElement = MillerColumnsElement
  window.customElements.define('govuk-miller-columns', MillerColumnsElement)
}

export default MillerColumnsElement
