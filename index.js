/* @flow */

class MillerColumnsElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.textContent = '<govuk-miller-columns>'
  }

  disconnectedCallback() {}
}

export default MillerColumnsElement

if (!window.customElements.get('govuk-miller-columns')) {
  window.MillerColumnsElement = MillerColumnsElement
  window.customElements.define('govuk-miller-columns', MillerColumnsElement)
}
