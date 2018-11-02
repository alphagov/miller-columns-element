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
        <govuk-miller-columns for="taxonomy" breadcrumbs="selected-items">
        <ul id="taxonomy">
          <li>
            Parenting, childcare and children&#39;s services
            <ul>
              <li>
                Divorce, separation and legal issues
                <ul>
                  <li>
                    Disagreements about parentage
                  </li>
                  <li>
                    Child maintenance
                  </li>
                  <li>
                    Child custody
                  </li>
                </ul>
              </li>
              <li>
                Childcare and early years
                <ul>
                  <li>
                    Local authorities and early years
                  </li>
                  <li>
                    Providing childcare
                    <ul>
                      <li>
                        Recruiting and managing early years staff
                      </li>
                      <li>
                        Performance and inspection of childcare providers
                      </li>
                      <li>
                        Funding and finance for childcare providers
                      </li>
                      <li>
                        Early years curriculum (0 to 5)
                      </li>
                      <li>
                        Children&#39;s centres, childminders, pre-schools and nurseries
                      </li>
                      <li>
                        Becoming a childcare provider
                      </li>
                    </ul>
                  </li>
                  <li>
                    Finding childcare
                  </li>
                  <li>
                    Data collection for early years and childcare
                    <ul>
                      <li>
                        Early years census
                      </li>
                      <li>
                        Early years foundation stage profile return
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                Financial help if you have children
                <ul>
                  <li>
                    Child benefit
                  </li>
                  <li>
                    Financial help if you have a disabled child
                  </li>
                  <li>
                    Tax credits if you have children
                  </li>
                  <li>
                    Savings accounts for children
                  </li>
                  <li>
                    Financial support for childcare
                  </li>
                  <li>
                    Financial help when having a baby
                  </li>
                  <li>
                    Financial help if you&#39;re a student with children
                  </li>
                </ul>
              </li>
              <li>
                Adoption, fostering and surrogacy
                <ul>
                  <li>
                    Intercountry adoption
                  </li>
                  <li>
                    Adoption
                  </li>
                  <li>
                    Surrogacy
                  </li>
                  <li>
                    Special guardianship
                  </li>
                  <li>
                    Fostering
                  </li>
                </ul>
              </li>
              <li>
                Children&#39;s health and welfare
                <ul>
                  <li>
                    Support for children with special educational needs and disabilities (SEND)
                  </li>
                  <li>
                    Mental health of children and young people
                  </li>
                  <li>
                    Help for children with a long-term illness or disability
                  </li>
                  <li>
                    Children&#39;s rights
                  </li>
                  <li>
                    Child poverty
                  </li>
                </ul>
              </li>
              <li>
                Youth employment and social issues
              </li>
              <li>
                Pregnancy and birth
                <ul>
                  <li>
                    Working and time off when you&#39;re having a baby
                  </li>
                  <li>
                    Register the birth of a child
                  </li>
                </ul>
              </li>
              <li>
                Safeguarding and social care for children
                <ul>
                  <li>
                    Child and family social work
                  </li>
                  <li>
                    Safeguarding and child protection
                    <ul>
                      <li>
                        Data collection for safeguarding and child protection
                      </li>
                      <li>
                        Preventing neglect, abuse and exploitation
                      </li>
                      <li>
                        Serious case reviews
                      </li>
                      <li>
                        Refugee, runaway and homeless children
                      </li>
                      <li>
                        Child abduction and cross-border child protection
                      </li>
                    </ul>
                  </li>
                  <li>
                    Looked-after children and children in care
                    <ul>
                      <li>
                        Data collection for looked-after children
                      </li>
                      <li>
                        Health, wellbeing and education of looked-after children
                      </li>
                      <li>
                        Children&#39;s homes and other accommodation
                      </li>
                      <li>
                        Children and young people leaving care
                      </li>
                    </ul>
                  </li>
                  <li>
                    Children&#39;s social care providers
                    <ul>
                      <li>
                        Becoming a children&#39;s social care provider
                      </li>
                      <li>
                        Social care provider complaints
                      </li>
                      <li>
                        Inspection of children&#39;s social care providers
                        <ul>
                          <li>
                            Inspections of local authority children&#39;s services
                          </li>
                          <li>
                            Inspections of fostering and adoption agencies
                          </li>
                          <li>
                            Incidents, concerns and feedback about children&#39;s social care providers
                          </li>
                          <li>
                            Children&#39;s homes and other residential care inspections
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        </govuk-miller-columns>
        <div class="govuk-breadcrumbs" id="selected-items"></div>
      `
      document.body.append(container)
    })

    afterEach(function() {
      document.body.innerHTML = ''
    })

    it('unnest lists', function() {
      const lists = document.querySelectorAll('ul')
      assert.equal(lists.length, 15)
    })

    it('store tree depth', function() {
      const millerColumns = document.querySelector('govuk-miller-columns')
      assert.equal(millerColumns.getAttribute('data-depth'), '5')
    })

    it('store list levels', function() {
      const l1Lists = document.querySelectorAll('ul[data-level="1"]')
      assert.equal(l1Lists.length, 1)

      const l2Lists = document.querySelectorAll('ul[data-level="2"]')
      assert.equal(l2Lists.length, 1)

      const l3Lists = document.querySelectorAll('ul[data-level="3"]')
      assert.equal(l3Lists.length, 7)

      const l4Lists = document.querySelectorAll('ul[data-level="4"]')
      assert.equal(l4Lists.length, 5)

      const l5Lists = document.querySelectorAll('ul[data-level="5"]')
      assert.equal(l5Lists.length, 1)
    })

    it('mark items with children as parents', function() {
      const firstItem = document.querySelector('ul[data-level="1"] li')
      assert.equal(firstItem.getAttribute('data-parent'), 'true')
    })

    it('store state for active items', function() {
      const firstItem = document.querySelector('ul[data-level="1"] li')
      firstItem.click()
      assert.equal(firstItem.getAttribute('data-selected'), 'true')
    })

    it('show the child list for active list items', function() {
      const firstItem = document.querySelector('ul[data-level="1"] li')
      const l2List = document.querySelector('ul[data-level="2"]')
      firstItem.click()
      assert.equal(l2List.getAttribute('data-collapse'), 'false')
    })

    it('unselect children when item is unselected', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li')
      const firstItemL2 = document.querySelector('ul[data-level="2"] li')
      firstItemL1.click()
      firstItemL2.click()
      firstItemL1.click()
      assert.equal(firstItemL2.getAttribute('data-selected'), 'false')
    })

    it('store active items in breadcrumb', function() {
      const firstItemL1 = document.querySelector('ul[data-level="1"] li')
      const firstItemL2 = document.querySelector('ul[data-level="2"] li')
      firstItemL1.click()
      firstItemL2.click()
      const breadcrumbsL1 = document.querySelector('.govuk-breadcrumbs ol li:nth-child(1)')
      const breadcrumbsL2 = document.querySelector('.govuk-breadcrumbs ol li:nth-child(2)')
      assert.equal(breadcrumbsL1.innerHTML.trim(), firstItemL1.innerHTML.trim())
      assert.equal(breadcrumbsL2.innerHTML.trim(), firstItemL2.innerHTML.trim())
    })

    // if('creates a new chain when selecting siblings or add them with coma in the same list', function() {
    //
    // })

    // if('removes a chain from stored breadcrumbs', function() {
    //
    // })

    // if('use checkboxes to illustrate selection', function() {
    //
    // })

    // if('add pre-checked items to selected topics when initialised', function() {
    //
    // })
  })
})
