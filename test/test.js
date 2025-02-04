import {assert} from 'chai'

describe('miller-columns', function() {
  describe('element creation', function() {
    it('creates from document.createElement', function() {
      const el = document.createElement('miller-columns')
      assert.equal('MILLER-COLUMNS', el.nodeName)
    })

    it('creates from constructor', function() {
      const el = new window.MillerColumnsElement()
      assert.equal('MILLER-COLUMNS', el.nodeName)
    })
  })

  describe('after tree insertion', function() {
    function pressKey(key, element) {
      const event = document.createEvent('Event')
      event.initEvent('keydown', true, true)
      event.key = key
      element.dispatchEvent(event)
    }

    beforeEach(function() {
      const container = document.createElement('div')
      container.innerHTML = `
        <miller-columns-selected id="selected-items" for="miller-columns"></miller-columns-selected>
        <p id="navigation-instructions" class="govuk-body govuk-visually-hidden">Use the right arrow to explore sub-topics, use the up and down arrows to find other topics.</p>
        <miller-columns id="miller-columns" for="taxonomy" selected="selected-items" aria-describedby="navigation-instructions">
          <ul id="taxonomy">
          <li>
             <div class="govuk-checkboxes__item">
                <input type="checkbox" id="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-checkboxes__input" name="topics[]" value="206b7f3a-49b5-476f-af0f-fd27e2a68473">
                <label for="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-label govuk-checkboxes__label" id="parenting-childcare-and-childrens-services">
                Parenting, childcare and children's services
                </label>
             </div>
             <ul>
                <li>
                   <div class="govuk-checkboxes__item">
                      <input type="checkbox" id="topic-1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" class="govuk-checkboxes__input" name="topics[]" value="1423ec9f-d62c-40f7-b10e-a2bdf020d8b7">
                      <label for="topic-1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" class="govuk-label govuk-checkboxes__label" id="divorce-separation-and-legal-issues">
                      Divorce, separation and legal issues
                      </label>
                   </div>
                   <ul>
                      <li>
                         <div class="govuk-checkboxes__item">
                            <input type="checkbox" id="topic-9ed56732-8600-493e-8467-295233529718" class="govuk-checkboxes__input" name="topics[]" value="9ed56732-8600-493e-8467-295233529718">
                            <label for="topic-9ed56732-8600-493e-8467-295233529718" class="govuk-label govuk-checkboxes__label" id="child-custody">
                            Child custody
                            </label>
                         </div>
                      </li>
                      <li>
                         <div class="govuk-checkboxes__item">
                            <input type="checkbox" id="topic-237b2e72-c465-42fe-9293-8b6af21713c0" class="govuk-checkboxes__input" name="topics[]" value="237b2e72-c465-42fe-9293-8b6af21713c0">
                            <label for="topic-237b2e72-c465-42fe-9293-8b6af21713c0" class="govuk-label govuk-checkboxes__label" id="disagreements-about-parentage">
                            Disagreements about parentage
                            </label>
                         </div>
                      </li>
                   </ul>
                </li>
                <li>
                   <div class="govuk-checkboxes__item">
                      <input type="checkbox" id="topic-f1d9c348-5c5e-4fc6-9172-13a62537d3ae" class="govuk-checkboxes__input" name="topics[]" value="f1d9c348-5c5e-4fc6-9172-13a62537d3ae">
                      <label for="topic-f1d9c348-5c5e-4fc6-9172-13a62537d3ae" class="govuk-label govuk-checkboxes__label">
                      Childcare and early years
                      </label>
                   </div>
                   <ul>
                      <li>
                         <div class="govuk-checkboxes__item">
                            <input type="checkbox" id="topic-1da1c700-cef8-45c4-9bb7-11a4b0003e10" class="govuk-checkboxes__input" name="topics[]" value="1da1c700-cef8-45c4-9bb7-11a4b0003e10">
                            <label for="topic-1da1c700-cef8-45c4-9bb7-11a4b0003e10" class="govuk-label govuk-checkboxes__label">
                            Local authorities and early years
                            </label>
                         </div>
                      </li>
                   </ul>
                </li>
             </ul>
          </li>
          <li>
             <div class="govuk-checkboxes__item">
                <input type="checkbox" id="topic-206b7f3a-49b5-476f-af0f-fd27e2a68474" class="govuk-checkboxes__input" name="topics[]" value="206b7f3a-49b5-476f-af0f-fd27e2a68474">
                <label for="topic-206b7f3a-49b5-476f-af0f-fd27e2a68474" class="govuk-label govuk-checkboxes__label">
                Corporate information
                </label>
             </div>
          </li>
          </ul>
        </miller-columns>
      `
      document.body.append(container)
    })

    afterEach(function() {
      document.body.innerHTML = undefined
    })

    it('unnests lists', function() {
      const lists = document.querySelectorAll('ul')
      assert.equal(lists.length, 4)
    })

    it('marks items with children as parents', function() {
      const firstItem = document.querySelector('ul li')
      assert.isTrue(firstItem.classList.contains('miller-columns__item--parent'))
    })

    it('marks selected item as active when clicked', function() {
      const firstItem = document.querySelector('ul li')
      const firstItemCheckbox = firstItem.querySelector('input')
      firstItemCheckbox.addEventListener('click', function(e) {
        assert.deepEqual(e.target, firstItemCheckbox)
      })

      firstItem.click()

      assert.isTrue(firstItem.classList.contains('miller-columns__item--active'))
      assert.isTrue(firstItem.querySelector('input').checked)
    })

    it('marks selected item as active when pressing Enter', function() {
      const firstItem = document.querySelector('ul li')
      const firstItemCheckbox = firstItem.querySelector('input')
      firstItemCheckbox.addEventListener('keydown', function(e) {
        assert.deepEqual(e.target, firstItemCheckbox)
      })

      firstItem.focus()
      pressKey('Enter', firstItemCheckbox)

      assert.isTrue(firstItem.classList.contains('miller-columns__item--active'))
      assert.isTrue(firstItem.querySelector('input').checked)
    })

    it('marks selected item as active when pressing Space', function() {
      const firstItem = document.querySelector('ul li')
      const firstItemCheckbox = firstItem.querySelector('input')
      firstItemCheckbox.addEventListener('keydown', function(e) {
        assert.deepEqual(e.target, firstItemCheckbox)
      })

      firstItem.focus()
      pressKey(' ', firstItemCheckbox)

      assert.isTrue(firstItem.classList.contains('miller-columns__item--active'))
      assert.isTrue(firstItem.querySelector('input').checked)
    })

    it('marks next item as focused when pressing ArrowDown', function() {
      const firstItem = document.querySelector('.miller-columns__column li:nth-of-type(1)')
      const secondItem = document.querySelector('.miller-columns__column li:nth-of-type(2)')

      firstItem.focus()
      pressKey('ArrowDown', firstItem)

      assert.deepEqual(secondItem, document.activeElement)
    })

    it('marks previous item as focused when pressing ArrowUp', function() {
      const firstItem = document.querySelector('.miller-columns__column li:nth-of-type(1)')
      const secondItem = document.querySelector('.miller-columns__column li:nth-of-type(2)')

      secondItem.focus()
      pressKey('ArrowUp', secondItem)

      assert.deepEqual(firstItem, document.activeElement)
    })

    it('marks first child item as focused when pressing ArrowRight', function() {
      const firstItemL1 = document.querySelector('.miller-columns__column:nth-of-type(1) li')
      const firstItemL2 = document.querySelector('.miller-columns__column:nth-of-type(2) li')

      firstItemL1.focus()
      pressKey('ArrowRight', firstItemL1)

      assert.deepEqual(firstItemL2, document.activeElement)
    })

    it('marks parent item as focused when pressing ArrowLeft', function() {
      const firstItemL1 = document.querySelector('.miller-columns__column:nth-of-type(1) li')
      const firstItemL2 = document.querySelector('.miller-columns__column:nth-of-type(2) li')

      firstItemL2.focus()
      pressKey('ArrowLeft', firstItemL2)

      assert.deepEqual(firstItemL1, document.activeElement)
    })

    it('shows the child list for active list item', function() {
      const firstItem = document.querySelector('ul li')
      const l2List = document.querySelectorAll('.miller-columns__column')[1]
      assert.isTrue(l2List.classList.contains('miller-columns__column--collapse'))
      firstItem.click()
      assert.isFalse(l2List.classList.contains('miller-columns__column--collapse'))
    })

    it('unselects children when item is unselected', function() {
      const firstItemL1 = document.querySelector('.miller-columns__column:nth-of-type(1) li')
      const firstItemL2 = document.querySelector('.miller-columns__column:nth-of-type(2) li')
      firstItemL1.click()
      firstItemL2.click()
      firstItemL1.click()

      assert.isFalse(firstItemL2.classList.contains('miller-columns__item--selected'))
      assert.isFalse(firstItemL2.querySelector('input').checked)
    })

    it("doesn't unselect items above the item that was clicked in the tree", function() {
      const firstItemL1 = document.querySelector('.miller-columns__column:nth-of-type(1) li')
      firstItemL1.click()
      const firstItemL2 = document.querySelector(
        '.miller-columns__column:not(.miller-columns__column--collapse):nth-of-type(2) li'
      )
      firstItemL2.click()

      firstItemL2.click()

      assert.isFalse(firstItemL2.classList.contains('miller-columns__item--selected'))
      assert.isFalse(firstItemL2.querySelector('input').checked)
      assert.isTrue(firstItemL1.classList.contains('miller-columns__item--selected'))
      assert.isTrue(firstItemL1.querySelector('input').checked)
    })

    it('shows active items in selected items', function() {
      const firstItemL1 = document.querySelector('.miller-columns__column:nth-of-type(1) li')
      const firstLabelL1 = firstItemL1.querySelector('label')
      const firstItemL2 = document.querySelector('.miller-columns__column:nth-of-type(2) li')
      const firstLabelL2 = firstItemL2.querySelector('label')
      firstItemL1.click()
      firstItemL2.click()
      const selected = document.querySelector('#selected-items ol')
      assert.equal(selected.childNodes.length, 1)
      assert.isTrue(selected.textContent.includes(firstLabelL1.textContent))
      assert.isTrue(selected.textContent.includes(firstLabelL2.textContent))
    })

    it('removes a chain from stored selected items', function() {
      const firstItemL1 = document.querySelector('.miller-columns__column li')
      const millerColumnsSelected = document.querySelector('miller-columns-selected')
      millerColumnsSelected.addEventListener('remove-topic', function(e) {
        assert.equal(e.detail.topicName, "Parenting, childcare and children's services")
      })

      firstItemL1.click()

      const firstItemRemove = document.querySelector('#selected-items button')
      const firstItemRemoveHiddenText = firstItemRemove.querySelector('.miller-columns-selected__remove-topic-name')
      assert.include(firstItemRemoveHiddenText.textContent, "Parenting, childcare and children's services")
      firstItemRemove.click()

      const selectedItems = document.querySelector('#selected-items')
      assert.equal(selectedItems.textContent, 'No selected topics')
    })

    it('creates entries of selected item for adjacent topics', function() {
      const firstItemL1 = document.querySelector('.miller-columns__column:nth-of-type(1) li')
      const firstItemL2 = document.querySelector('.miller-columns__column:nth-of-type(2) li')
      const secondItemL2 = document.querySelector('.miller-columns__column:nth-of-type(2) li:nth-of-type(2)')

      const firstLabelL2 = firstItemL2.querySelector('label')
      const secondLabelL2 = secondItemL2.querySelector('label')

      firstItemL1.click()
      firstItemL2.click()
      secondItemL2.click()

      const selectedItems = document.querySelector('#selected-items ol')
      assert.equal(selectedItems.childNodes.length, 2)
      assert.isTrue(selectedItems.textContent.includes(firstLabelL2.textContent))
      assert.isTrue(selectedItems.textContent.includes(secondLabelL2.textContent))
    })

    it('provides an API to access the breadcrumb trail of a topic', function() {
      const firstItemL2 = document.querySelector('miller-columns').taxonomy.topics[0].children[0]
      assert.deepEqual(firstItemL2.topicNames, [
        "Parenting, childcare and children's services",
        'Divorce, separation and legal issues'
      ])
    })

    it('provides an API to access children topics in a flat list', function() {
      const firstItemL1 = document.querySelector('miller-columns').taxonomy.topics[0]
      assert.equal(firstItemL1.flattenedChildren.length, 5)
    })

    it('provides an API to access all topics in a flat list', function() {
      const millerColumns = document.querySelector('miller-columns')
      assert.equal(millerColumns.taxonomy.flattenedTopics.length, 7)
    })

    it('shows active column while selecting items', function() {
      const firstColumn = document.querySelectorAll('.miller-columns__column')[0]
      const firstItemL1 = firstColumn.querySelector('li')
      const secondItemL1 = firstColumn.querySelector('li:nth-of-type(2)')
      const secondColumn = document.querySelectorAll('.miller-columns__column')[1]
      const firstItemL2 = secondColumn.querySelector('li')
      const thirdColumn = document.querySelectorAll('.miller-columns__column')[2]

      assert.equal(document.querySelector('.miller-columns__column--active'), firstColumn)
      firstItemL1.click()
      assert.equal(document.querySelector('.miller-columns__column--active'), secondColumn)
      firstItemL2.click()
      assert.equal(document.querySelector('.miller-columns__column--active'), thirdColumn)
      secondItemL1.click()
      assert.equal(document.querySelector('.miller-columns__column--active'), firstColumn)
    })

    it('shows parent element as heading for each column', function() {
      const firstColumn = document.querySelectorAll('.miller-columns__column')[0]
      const firstLabelL1 = firstColumn.querySelector('label')
      const secondColumn = document.querySelectorAll('.miller-columns__column')[1]
      const headingL2 = secondColumn.querySelector('.miller-columns__column-heading')
      assert.isTrue(firstLabelL1.textContent.includes(headingL2.textContent))
    })

    it('shows previous column when back link button is clicked', function() {
      const firstColumn = document.querySelectorAll('.miller-columns__column')[0]
      const firstItemL1 = firstColumn.querySelector('li')
      const secondColumn = document.querySelectorAll('.miller-columns__column')[1]
      const backButtonL2 = secondColumn.querySelector('.govuk-back-link')

      firstItemL1.click()
      assert.equal(document.querySelector('.miller-columns__column--active'), secondColumn)

      backButtonL2.click()
      assert.equal(document.querySelector('.miller-columns__column--active'), firstColumn)
    })

    it('applies aria-describedby to each individual item', function() {
      const millerColumnsElement = document.querySelector('miller-columns')
      const describedbyId = millerColumnsElement.getAttribute('aria-describedby')

      const millerColumnsItem = document.querySelector('.miller-columns__item')

      assert.equal(millerColumnsItem.getAttribute('aria-describedby'), describedbyId)
    })

    it('adds each item to the tab order', function() {
      const millerColumnsItem = document.querySelector('.miller-columns__item')

      assert.equal(millerColumnsItem.getAttribute('tabindex'), '0')
    })

    it('removes checkboxes from the focus order', function() {
      const item = document.querySelector('ul li')
      const itemCheckbox = item.querySelector('input')

      assert.equal(itemCheckbox.getAttribute('tabindex'), '-1')
    })
  })

  describe('when loading pre-selected items', function() {
    beforeEach(function() {
      const container = document.createElement('div')
      container.innerHTML = `
        <miller-columns-selected id="selected-items" for="miller-columns"></miller-columns-selected>
        <miller-columns id="miller-columns" for="taxonomy" selected="selected-items">
          <ul id="taxonomy">
          <li>
             <div class="govuk-checkboxes__item">
                <input type="checkbox" id="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-checkboxes__input" name="topics[]" value="206b7f3a-49b5-476f-af0f-fd27e2a68473">
                <label for="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-label govuk-checkboxes__label">
                Parenting, childcare and children's services
                </label>
             </div>
             <ul>
                <li>
                   <div class="govuk-checkboxes__item">
                      <input type="checkbox" id="topic-1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" class="govuk-checkboxes__input" name="topics[]" value="1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" checked>
                      <label for="topic-1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" class="govuk-label govuk-checkboxes__label">
                      Divorce, separation and legal issues
                      </label>
                   </div>
                   <ul>
                      <li>
                         <div class="govuk-checkboxes__item">
                            <input type="checkbox" id="topic-9ed56732-8600-493e-8467-295233529718" class="govuk-checkboxes__input" name="topics[]" value="9ed56732-8600-493e-8467-295233529718">
                            <label for="topic-9ed56732-8600-493e-8467-295233529718" class="govuk-label govuk-checkboxes__label">
                            Child custody
                            </label>
                         </div>
                      </li>
                      <li>
                         <div class="govuk-checkboxes__item">
                            <input type="checkbox" id="topic-237b2e72-c465-42fe-9293-8b6af21713c0" class="govuk-checkboxes__input" name="topics[]" value="237b2e72-c465-42fe-9293-8b6af21713c0">
                            <label for="topic-237b2e72-c465-42fe-9293-8b6af21713c0" class="govuk-label govuk-checkboxes__label">
                            Disagreements about parentage
                            </label>
                         </div>
                      </li>
                   </ul>
                </li>
                <li>
                   <div class="govuk-checkboxes__item">
                      <input type="checkbox" id="topic-f1d9c348-5c5e-4fc6-9172-13a62537d3ae" class="govuk-checkboxes__input" name="topics[]" value="f1d9c348-5c5e-4fc6-9172-13a62537d3ae">
                      <label for="topic-f1d9c348-5c5e-4fc6-9172-13a62537d3ae" class="govuk-label govuk-checkboxes__label">
                      Childcare and early years
                      </label>
                   </div>
                   <ul>
                      <li>
                         <div class="govuk-checkboxes__item">
                            <input type="checkbox" id="topic-1da1c700-cef8-45c4-9bb7-11a4b0003e10" class="govuk-checkboxes__input" name="topics[]" value="1da1c700-cef8-45c4-9bb7-11a4b0003e10">
                            <label for="topic-1da1c700-cef8-45c4-9bb7-11a4b0003e10" class="govuk-label govuk-checkboxes__label">
                            Local authorities and early years
                            </label>
                         </div>
                      </li>
                   </ul>
                </li>
             </ul>
          </li>
          </ul>
        </miller-columns>
      `
      document.body.append(container)
    })

    afterEach(function() {
      document.body.innerHTML = undefined
    })

    it('marks items with checked inputs as selected', function() {
      const selectedCheckbox = document.querySelector('ul li input:checked')
      const listItem = selectedCheckbox.closest('li')
      assert.isTrue(listItem.classList.contains('miller-columns__item--active'))
      assert.isTrue(listItem.querySelector('input').checked)
    })

    it('marks selected item’s parent as selected', function() {
      const listItem = document.querySelector('ul li')
      assert.isTrue(listItem.classList.contains('miller-columns__item--active'))
      assert.isTrue(listItem.querySelector('input').checked)
    })
  })
})
