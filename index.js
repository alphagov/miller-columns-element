/* @flow */

function nodesToArray(nodes: NodeList<HTMLElement> | HTMLCollection<HTMLElement>): Array<HTMLElement> {
  return Array.prototype.slice.call(nodes)
}

class Taxonomy {
  taxons: Array<Taxon>
  millerColumns: MillerColumnsElement
  active: ?Taxon
  constructor(taxons: Array<Taxon>, millerColumns: MillerColumnsElement) {
    this.taxons = taxons
    this.millerColumns = millerColumns
    this.active = this.selectedTaxons[0]
  }

  get selectedTaxons(): Array<Taxon> {
    return this.taxons.reduce((memo, taxon) => {
      if (taxon.selected) {
        memo.push(taxon)
      }

      return memo.concat(taxon.selectedChildren)
    }, [])
  }

  toggleSelection(taxon: Taxon) {
    // if this is the active taxon or a parent of it we deselect
    if (taxon === this.active || taxon.parentOf(this.active)) {
      taxon.deselect()
      if (taxon.parent) {
        taxon.parent.select()
      }
      this.active = taxon.parent
    } else if (taxon.selected || taxon.selectedChildren.length) {
      // if this is a selected taxon with children we make it active to allow
      // picking the children
      if (taxon.children.length) {
        this.active = taxon
      } else {
        // otherwise we deselect it as we take the click as they can't be
        // traversing
        taxon.deselect()
        if (taxon.parent) {
          taxon.parent.select()
        }
        this.active = taxon.parent
      }
    } else {
      // otherwise this is a new selection
      taxon.select()
      this.active = taxon
    }

    this.millerColumns.update()
  }

  removeTopic(taxon: Taxon) {
    taxon.deselect()
    // determine which topic to mark as active, if any
    this.active = this.determineActiveFromRemoved(taxon)
    this.millerColumns.update()
  }

  determineActiveFromRemoved(taxon: Taxon): ?Taxon {
    // if there is already an active item with selected children lets not
    // change anything
    if (this.active && (this.active.selected || this.active.selectedChildren.length)) {
      return this.active
    }

    // see if there is a parent with selected taxons, that feels like the most
    // natural place to end up
    for (const parent of taxon.parents.reverse()) {
      if (parent.selectedChildren.length) {
        return parent
      }
    }

    // if we've still not got one we'll go for the first selected one
    return this.selectedTaxons[0]
  }
}

class Taxon {
  static fromList(list: ?HTMLElement, parent: ?Taxon = null) {
    const taxons = []
    if (!list) {
      return taxons
    }

    for (const item of list.children) {
      const label = item.querySelector('label')
      const checkbox = item.querySelector('input')
      if (label instanceof HTMLLabelElement && checkbox instanceof HTMLInputElement) {
        let childList = item.querySelector('ul')
        childList = childList instanceof HTMLUListElement ? childList : null

        const taxon = new Taxon(label, checkbox, childList, parent)
        taxons.push(taxon)
      }
    }

    return taxons
  }

  label: HTMLLabelElement
  checkbox: HTMLInputElement
  children: Array<Taxon>
  parent: ?Taxon
  selected: boolean

  constructor(label: HTMLLabelElement, checkbox: HTMLInputElement, childList: ?HTMLUListElement, parent: ?Taxon) {
    this.label = label
    this.checkbox = checkbox
    this.parent = parent
    this.children = Taxon.fromList(childList, this)

    if (!this.children.length && this.checkbox.checked) {
      this.selected = true
      if (this.parent) {
        this.parent.childWasSelected()
      }
    }
  }

  get selectedChildren(): Array<Taxon> {
    return this.children.reduce((memo, taxon) => {
      const selected = taxon.selectedChildren
      if (taxon.selected) {
        selected.push(taxon)
      }
      return memo.concat(selected)
    }, [])
  }

  get parents(): Array<Taxon> {
    if (this.parent) {
      return this.parent.parents.concat([this.parent])
    } else {
      return []
    }
  }

  parentOf(other: ?Taxon): boolean {
    if (!other) {
      return false
    }

    return this.children.reduce((memo, taxon) => {
      if (memo) {
        return true
      }

      return taxon === other || taxon.parentOf(other)
    }, false)
  }

  withParents(): Array<Taxon> {
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

      for (const taxon of deepestFirst) {
        // if the parent has selected children it should remain ticked
        if (taxon.selectedChildren.length) {
          break
        } else {
          taxon.selected = false
          taxon.checkbox.checked = false
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
      this.taxonomy = new Taxonomy(Taxon.fromList(source), this)
      this.renderTaxonomyColumn(this.taxonomy.taxons, true)
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

  renderTaxonomyColumn(taxons: Array<Taxon>, root: boolean = false) {
    const ul = document.createElement('ul')
    ul.className = this.classNames.column
    if (root) {
      ul.dataset.root = 'true'
    } else {
      ul.classList.add(this.classNames.columnCollapse)
    }
    this.appendChild(ul)
    for (const taxon of taxons) {
      this.renderTaxon(taxon, ul)
    }
  }

  renderTaxon(taxon: Taxon, list: HTMLElement) {
    const li = document.createElement('li')
    li.classList.add(this.classNames.item)
    const div = document.createElement('div')
    div.className = 'govuk-checkboxes__item'
    div.appendChild(taxon.checkbox)
    div.appendChild(taxon.label)
    li.appendChild(div)
    list.appendChild(li)
    this.attachEvents(li, taxon)
    if (taxon.children.length) {
      li.classList.add(this.classNames.itemParent)
      this.renderTaxonomyColumn(taxon.children)
    }
  }

  attachEvents(trigger: HTMLElement, taxon: Taxon) {
    trigger.tabIndex = 0
    const fn = this.selectTaxon.bind(this, taxon)
    trigger.addEventListener('click', fn, false)
  }

  selectTaxon(taxon: Taxon) {
    this.taxonomy.toggleSelection(taxon)
  }

  update() {
    this.showStoredTaxons(this.taxonomy.selectedTaxons)
    this.showActiveTaxon(this.taxonomy.active)

    if (this.selectedElement) {
      this.selectedElement.update(this.taxonomy)
    }
  }

  showStoredTaxons(taxons: Array<Taxon>) {
    const storedItems = this.itemsForStoredTaxons(taxons)
    const currentlyStored = nodesToArray(this.getElementsByClassName(this.classNames.itemStored))

    for (const item of currentlyStored.concat(storedItems)) {
      if (storedItems.indexOf(item) !== -1) {
        item.classList.add(this.classNames.itemStored)
      } else {
        item.classList.remove(this.classNames.itemStored)
      }
    }
  }

  showActiveTaxon(taxon: ?Taxon) {
    const activeItems = this.itemsForActiveTaxon(taxon)
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
    const columnsToShow = this.columnsForActiveTaxon(taxon)

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

  itemsForActiveTaxon(taxon: ?Taxon) {
    if (!taxon) {
      return []
    }

    return taxon.withParents().reduce((memo, taxon) => {
      const item = taxon.checkbox.closest(`.${this.classNames.item}`)
      return memo.concat([item])
    }, [])
  }

  itemsForStoredTaxons(taxons: Array<Taxon>): Array<HTMLElement> {
    return taxons.reduce((memo, child) => {
      for (const taxon of child.withParents()) {
        const item = taxon.checkbox.closest(`.${this.classNames.item}`)
        if (item instanceof HTMLElement) {
          memo.push(item)
        }
      }

      return memo
    }, [])
  }

  columnsForActiveTaxon(taxon: ?Taxon) {
    if (!taxon) {
      return []
    }

    const columnSelector = `.${this.classNames.column}`
    const columns = taxon.withParents().reduce((memo, taxon) => {
      const column = taxon.checkbox.closest(columnSelector)
      return memo.concat([column])
    }, [])

    // we'll want to show the next column too
    if (taxon.children.length) {
      columns.push(taxon.children[0].checkbox.closest(columnSelector))
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
    const selectedTaxons = taxonomy.selectedTaxons
    while (this.list.lastChild) {
      this.list.removeChild(this.list.lastChild)
    }

    if (selectedTaxons.length) {
      for (const taxon of selectedTaxons) {
        this.addSelectedTaxon(taxon)
      }
    } else {
      const li = document.createElement('li')
      li.className = 'govuk-miller-columns-selected__list-item'
      li.textContent = 'No selected topics'
      this.list.appendChild(li)
    }
  }

  addSelectedTaxon(taxon: Taxon) {
    const li = document.createElement('li')
    li.className = 'govuk-miller-columns-selected__list-item'
    li.appendChild(this.breadcrumbsElement(taxon))
    li.appendChild(this.removeTopicElement(taxon))
    this.list.appendChild(li)
  }

  breadcrumbsElement(taxon: Taxon): HTMLElement {
    const div = document.createElement('div')
    div.className = 'govuk-breadcrumbs'
    const ol = document.createElement('ol')
    ol.className = 'govuk-breadcrumbs__list'
    for (const current of taxon.withParents()) {
      const li = document.createElement('li')
      li.className = 'govuk-breadcrumbs__list-item'
      li.textContent = current.label.textContent
      ol.appendChild(li)
    }
    div.appendChild(ol)
    return div
  }

  removeTopicElement(taxon: Taxon): HTMLElement {
    const button = document.createElement('button')
    button.className = 'govuk-miller-columns-selected__remove-topic'
    button.textContent = 'Remove topic'
    button.addEventListener('click', () => {
      if (this.taxonomy) {
        this.taxonomy.removeTopic(taxon)
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
