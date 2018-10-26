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
      container.innerHTML = '<govuk-miller-columns></govuk-miller-columns>'
      document.body.append(container)
    })

    afterEach(function() {
      document.body.innerHTML = ''
    })

    it('initiates', function() {
      const ce = document.querySelector('govuk-miller-columns')
      assert.equal(ce.textContent, '<govuk-miller-columns>')
    })
  })
})
