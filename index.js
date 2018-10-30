/* @flow */

class MillerColumnsElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const list = this.list
    if (list) {
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

          if (ancestor) {
            ancestor.dataset['parent'] = 'true'
            ancestor.className = 'app-miller-columns__item--parent'
          }

          // Causes item siblings to have a flattened DOM lineage.
          child.className = 'app-miller-columns__column'
          millercolumns.insertAdjacentElement('beforeend', child)
        }
      }
    }
  }

  root.dataset['depth'] = depth.toString()
}

if (!window.customElements.get('govuk-miller-columns')) {
  window.MillerColumnsElement = MillerColumnsElement
  window.customElements.define('govuk-miller-columns', MillerColumnsElement)
}

export default MillerColumnsElement
