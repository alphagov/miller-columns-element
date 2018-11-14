describe('govuk-miller-columns', function() {
  describe('element creation', function() {
    it('creates from document.createElement', function() {
      const el = document.createElement('govuk-miller-columns')
      assert.equal('GOVUK-MILLER-COLUMNS', el.nodeName)
    })

    it('creates from constructor', function() {
      const el = new window.MillerColumnsElement()
      assert.equal('GOVUK-MILLER-COLUMNS', el.nodeName)
    })
  })

  describe('after tree insertion', function() {
    beforeEach(function() {
      const container = document.createElement('div')
      container.innerHTML = `
        <govuk-breadcrumbs id="selected-items" for="miller-columns"></govuk-breadcrumbs>
        <govuk-miller-columns id="miller-columns" for="taxonomy" breadcrumbs="selected-items">
        <ul id="taxonomy">
        <li>
           <div class="govuk-checkboxes__item">
              <input type="checkbox" id="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-checkboxes__input" name="topics[]" value="206b7f3a-49b5-476f-af0f-fd27e2a68473" tabindex="-1">
              <label for="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-label govuk-checkboxes__label">
              Parenting, childcare and children's services
              </label>
           </div>
           <ul>
              <li>
                 <div class="govuk-checkboxes__item">
                    <input type="checkbox" id="topic-1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" class="govuk-checkboxes__input" name="topics[]" value="1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" tabindex="-1">
                    <label for="topic-1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" class="govuk-label govuk-checkboxes__label">
                    Divorce, separation and legal issues
                    </label>
                 </div>
                 <ul>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-9ed56732-8600-493e-8467-295233529718" class="govuk-checkboxes__input" name="topics[]" value="9ed56732-8600-493e-8467-295233529718" tabindex="-1">
                          <label for="topic-9ed56732-8600-493e-8467-295233529718" class="govuk-label govuk-checkboxes__label">
                          Child custody
                          </label>
                       </div>
                    </li>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-237b2e72-c465-42fe-9293-8b6af21713c0" class="govuk-checkboxes__input" name="topics[]" value="237b2e72-c465-42fe-9293-8b6af21713c0" tabindex="-1">
                          <label for="topic-237b2e72-c465-42fe-9293-8b6af21713c0" class="govuk-label govuk-checkboxes__label">
                          Disagreements about parentage
                          </label>
                       </div>
                    </li>
                 </ul>
              </li>
              <li>
                 <div class="govuk-checkboxes__item">
                    <input type="checkbox" id="topic-f1d9c348-5c5e-4fc6-9172-13a62537d3ae" class="govuk-checkboxes__input" name="topics[]" value="f1d9c348-5c5e-4fc6-9172-13a62537d3ae" tabindex="-1">
                    <label for="topic-f1d9c348-5c5e-4fc6-9172-13a62537d3ae" class="govuk-label govuk-checkboxes__label">
                    Childcare and early years
                    </label>
                 </div>
                 <ul>
                    <li>
                       <div class="govuk-checkboxes__item">
                          <input type="checkbox" id="topic-1da1c700-cef8-45c4-9bb7-11a4b0003e10" class="govuk-checkboxes__input" name="topics[]" value="1da1c700-cef8-45c4-9bb7-11a4b0003e10" tabindex="-1">
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
        </govuk-miller-columns>
      `
      document.body.append(container)
    })

    afterEach(function() {
      document.body.innerHTML = undefined
    })

    it('unnest lists', function() {
      const lists = document.querySelectorAll('ul')
      assert.equal(lists.length, 4)
    })

    it('store tree depth', function() {
      const millerColumns = document.querySelector('govuk-miller-columns')
      assert.equal(millerColumns.getAttribute('data-depth'), '3')
    })

    it('store list levels', function() {
      const l1Lists = document.querySelectorAll('ul[data-level="1"]')
      assert.equal(l1Lists.length, 1)

      const l2Lists = document.querySelectorAll('ul[data-level="2"]')
      assert.equal(l2Lists.length, 1)

      const l3Lists = document.querySelectorAll('ul[data-level="3"]')
      assert.equal(l3Lists.length, 2)
    })

    it('mark items with children as parents', function() {
      const firstItem = document.querySelector('ul[data-level="1"] li')
      assert.equal(firstItem.getAttribute('data-parent'), 'true')
    })

    it('store state for active items', function() {
      const firstItem = document.querySelector('ul[data-level="1"] li')
      firstItem.click()
      assert.equal(firstItem.getAttribute('data-selected'), 'true')

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()
    })

    it('show the child list for active list items', function() {
      const firstItem = document.querySelector('ul[data-level="1"] li')
      const l2List = document.querySelector('ul[data-level="2"]')
      firstItem.click()
      assert.equal(l2List.getAttribute('data-collapse'), 'false')

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()
    })

    it('unselect children when item is unselected', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li')
      const firstItemL2 = document.querySelector('ul[data-level="2"] li')
      firstItemL1.click()
      firstItemL2.click()
      firstItemL1.click()

      assert.equal(firstItemL2.dataset.selected, 'false')
    })

    it('store active items in breadcrumb', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li')
      const firstLabelL1 = document.querySelector('ul[data-level="1"] li label')
      const firstItemL2 = document.querySelector('ul[data-level="2"] li')
      const firstLabelL2 = document.querySelector('ul[data-level="2"] li label')
      firstItemL1.click()
      firstItemL2.click()
      const breadcrumbsL1 = document.querySelector('#selected-items ol li:nth-child(1)')
      const breadcrumbsL2 = document.querySelector('#selected-items ol li:nth-child(2)')
      assert.equal(breadcrumbsL1.innerHTML.trim(), firstLabelL1.innerHTML.trim())
      assert.equal(breadcrumbsL2.innerHTML.trim(), firstLabelL2.innerHTML.trim())

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()
    })

    it('removes a chain from stored breadcrumbs', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li:nth-child(1)')

      firstItemL1.click()

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()

      const breadcrumbs = document.querySelectorAll('#selected-items ol')
      assert.equal(breadcrumbs.length, 1)
    })

    it('use checkboxes to illustrate selection', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li:nth-child(1)')

      firstItemL1.click()

      const firstCheckbox = document.querySelector('ul[data-level="1"] li:nth-child(1) input[type=checkbox]')
      assert.equal(firstCheckbox.getAttribute('checked'), 'checked')

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()
    })

    it('creates a new chain when selecting siblings', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li')
      const firstItemL2 = document.querySelector('ul[data-level="2"] li:nth-child(1)')
      const secondItemL2 = document.querySelector('ul[data-level="2"] li:nth-child(2)')

      const firstLabelL1 = document.querySelector('ul[data-level="1"] li label')
      const firstLabelL2 = document.querySelector('ul[data-level="2"] li:nth-child(1) label')
      const secondLabelL2 = document.querySelector('ul[data-level="2"] li:nth-child(2) label')

      firstItemL1.click()
      firstItemL2.click()
      secondItemL2.click()

      const firstBreadcrumbsL1 = document.querySelector('#selected-items ol:nth-child(1) li:nth-child(1)')
      const firstBreadcrumbsL2 = document.querySelector('#selected-items ol:nth-child(1) li:nth-child(2)')
      const secondBreadcrumbsL1 = document.querySelector('#selected-items ol:nth-child(2) li:nth-child(1)')
      const secondBreadcrumbsL2 = document.querySelector('#selected-items ol:nth-child(2) li:nth-child(2)')

      assert.equal(firstBreadcrumbsL1.innerHTML.trim(), firstLabelL1.innerHTML.trim())
      assert.equal(firstBreadcrumbsL2.innerHTML.trim(), firstLabelL2.innerHTML.trim())
      assert.equal(secondBreadcrumbsL1.innerHTML.trim(), firstLabelL1.innerHTML.trim())
      assert.equal(secondBreadcrumbsL2.innerHTML.trim(), secondLabelL2.innerHTML.trim())

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()

      const secondBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      secondBreadcrumbsRemove.click()
    })

    it('selects all parents when selecting an item', function() {
      const firstItemL2 = document.querySelector('ul[data-level="2"] li:nth-child(1)')

      firstItemL2.click()

      const firstCheckbox = document.querySelector('ul[data-level="1"] li:nth-child(1) input[type=checkbox]')
      const secondCheckbox = document.querySelector('ul[data-level="2"] li:nth-child(1) input[type=checkbox]')
      assert.equal(firstCheckbox.getAttribute('checked'), 'checked')
      assert.equal(secondCheckbox.getAttribute('checked'), 'checked')

      const firstBreadcrumbsRemove = document.querySelector('#selected-items ol button')
      firstBreadcrumbsRemove.click()
    })
  })
})
