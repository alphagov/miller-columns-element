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
        <miller-columns id="miller-columns" for="taxonomy" selected="selected-items">
          <ul id="taxonomy">
          <li>
             <div class="govuk-checkboxes__item">
                <input type="checkbox" id="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-checkboxes__input" name="topics[]" value="206b7f3a-49b5-476f-af0f-fd27e2a68473" tabindex="-1">
                <label for="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-label govuk-checkboxes__label" id="parenting-childcare-and-childrens-services">
                Parenting, childcare and children's services
                </label>
             </div>
             <ul>
                <li>
                   <div class="govuk-checkboxes__item">
                      <input type="checkbox" id="topic-1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" class="govuk-checkboxes__input" name="topics[]" value="1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" tabindex="-1">
                      <label for="topic-1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" class="govuk-label govuk-checkboxes__label" id="divorce-separation-and-legal-issues">
                      Divorce, separation and legal issues
                      </label>
                   </div>
                   <ul>
                      <li>
                         <div class="govuk-checkboxes__item">
                            <input type="checkbox" id="topic-9ed56732-8600-493e-8467-295233529718" class="govuk-checkboxes__input" name="topics[]" value="9ed56732-8600-493e-8467-295233529718" tabindex="-1">
                            <label for="topic-9ed56732-8600-493e-8467-295233529718" class="govuk-label govuk-checkboxes__label" id="child-custody">
                            Child custody
                            </label>
                         </div>
                      </li>
                      <li>
                         <div class="govuk-checkboxes__item">
                            <input type="checkbox" id="topic-237b2e72-c465-42fe-9293-8b6af21713c0" class="govuk-checkboxes__input" name="topics[]" value="237b2e72-c465-42fe-9293-8b6af21713c0" tabindex="-1">
                            <label for="topic-237b2e72-c465-42fe-9293-8b6af21713c0" class="govuk-label govuk-checkboxes__label" id="disagreements-about-parentage">
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
        </miller-columns>
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

    it('mark items with children as parents', function() {
      const firstItem = document.querySelector('ul li')
      assert.isTrue(firstItem.classList.contains('miller-columns__item--parent'))
    })

    it('mark selected item as active when clicked', function() {
      const firstItem = document.querySelector('ul li')
      const firstItemCheckbox = firstItem.querySelector('input')
      firstItemCheckbox.addEventListener('click', function(e) {
        assert.deepEqual(e.target, firstItemCheckbox)
      })

      firstItem.click()

      assert.isTrue(firstItem.classList.contains('miller-columns__item--active'))
      assert.isTrue(firstItem.querySelector('input').checked)
    })

    it('mark selected item as active when pressing Enter', function() {
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

    it('mark selected item as active when pressing Space', function() {
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

    it('show the child list for active list item', function() {
      const firstItem = document.querySelector('ul li')
      const l2List = document.querySelectorAll('ul')[1]
      assert.isTrue(l2List.classList.contains('miller-columns__column--collapse'))
      firstItem.click()
      assert.isFalse(l2List.classList.contains('miller-columns__column--collapse'))
    })

    it('unselect children when item is unselected', function() {
      const firstItemL1 = document.querySelector('ul:nth-of-type(1) li')
      const firstItemL2 = document.querySelector('ul:nth-of-type(2) li')
      firstItemL1.click()
      firstItemL2.click()
      firstItemL1.click()

      assert.isFalse(firstItemL2.classList.contains('miller-columns__item--selected'))
      assert.isFalse(firstItemL2.querySelector('input').checked)
    })

    it("doesn't unselect items above the item that was clicked in the tree", function() {
      const firstItemL1 = document.querySelector('ul:nth-of-type(1) li')
      firstItemL1.click()
      const firstItemL2 = document.querySelector('ul:not(.miller-columns__column--collapse):nth-of-type(2) li')
      firstItemL2.click()

      firstItemL2.click()

      assert.isFalse(firstItemL2.classList.contains('miller-columns__item--selected'))
      assert.isFalse(firstItemL2.querySelector('input').checked)
      assert.isTrue(firstItemL1.classList.contains('miller-columns__item--selected'))
      assert.isTrue(firstItemL1.querySelector('input').checked)
    })

    it('shows active items in selected items', function() {
      const firstItemL1 = document.querySelector('ul:nth-of-type(1) li')
      const firstLabelL1 = firstItemL1.querySelector('label')
      const firstItemL2 = document.querySelector('ul:nth-of-type(2) li')
      const firstLabelL2 = firstItemL2.querySelector('label')
      firstItemL1.click()
      firstItemL2.click()
      const selected = document.querySelector('#selected-items ol')
      assert.equal(selected.childNodes.length, 1)
      assert.isTrue(selected.textContent.includes(firstLabelL1.textContent))
      assert.isTrue(selected.textContent.includes(firstLabelL2.textContent))
    })

    it('removes a chain from stored selected items', function() {
      const firstItemL1 = document.querySelector('ul li')
      const millerColumnsSelected = document.querySelector('miller-columns-selected')
      millerColumnsSelected.addEventListener('remove-topic', function(e) {
        assert.equal(e.detail.topicName, "Parenting, childcare and children's services")
      })

      firstItemL1.click()

      const firstItemRemove = document.querySelector('#selected-items button')
      firstItemRemove.click()

      const selectedItems = document.querySelector('#selected-items')
      assert.equal(selectedItems.textContent, 'No selected topics')
    })

    it('creates entries of selected item for adjacent topics', function() {
      const firstItemL1 = document.querySelector('ul:nth-child(1) li')
      const firstItemL2 = document.querySelector('ul:nth-child(2) li:nth-child(1)')
      const secondItemL2 = document.querySelector('ul:nth-child(2) li:nth-child(2)')

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

    it('provides an API to access a list of selected items by name', function() {
      const elements = [
        document.getElementById('parenting-childcare-and-childrens-services'),
        document.getElementById('divorce-separation-and-legal-issues'),
        document.getElementById('child-custody'),
        document.getElementById('disagreements-about-parentage')
      ]

      for (const element of elements) {
        element.closest('li').click()
      }

      const millerColumnsSelected = document.querySelector('miller-columns-selected')
      assert.deepEqual(millerColumnsSelected.selectedTopicNames(), [
        ["Parenting, childcare and children's services", 'Divorce, separation and legal issues', 'Child custody'],
        [
          "Parenting, childcare and children's services",
          'Divorce, separation and legal issues',
          'Disagreements about parentage'
        ]
      ])
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
      assert.equal(millerColumns.taxonomy.flattenedTopics.length, 6)
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
                <input type="checkbox" id="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-checkboxes__input" name="topics[]" value="206b7f3a-49b5-476f-af0f-fd27e2a68473" tabindex="-1">
                <label for="topic-206b7f3a-49b5-476f-af0f-fd27e2a68473" class="govuk-label govuk-checkboxes__label">
                Parenting, childcare and children's services
                </label>
             </div>
             <ul>
                <li>
                   <div class="govuk-checkboxes__item">
                      <input type="checkbox" id="topic-1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" class="govuk-checkboxes__input" name="topics[]" value="1423ec9f-d62c-40f7-b10e-a2bdf020d8b7" tabindex="-1" checked>
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
        </miller-columns>
      `
      document.body.append(container)
    })

    afterEach(function() {
      document.body.innerHTML = undefined
    })

    it('mark items with checked inputs as selected', function() {
      const selectedCheckbox = document.querySelector('ul li input:checked')
      const listItem = selectedCheckbox.closest('li')
      assert.isTrue(listItem.classList.contains('miller-columns__item--active'))
      assert.isTrue(listItem.querySelector('input').checked)
    })

    it('mark selected item’s parent as selected', function() {
      const listItem = document.querySelector('ul li')
      assert.isTrue(listItem.classList.contains('miller-columns__item--active'))
      assert.isTrue(listItem.querySelector('input').checked)
    })
  })
})
