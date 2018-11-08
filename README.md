# &lt;govuk-miller-columns&gt; element

Express a hierarchy by showing selectable lists of the items in each hierarchy level.

Selection of any item shows that item’s children in the next list.

## Installation

Add the compiled `/dist/index.umd.js` to your application assets.

An npm installation will be available at a future point.

## Usage

```html
<govuk-miller-columns for="taxonomy" breadcrumbs="selected-items">
  <ul id="taxonomy">
    <li>Parenting, childcare and children's services</li>
    <ul>
      <li>Divorce, separation and legal issues</li>
      <li>Childcare and early years</li>
    </ul>
  </ul>
</govuk-miller-columns>

<div id="selected-items"></div>
```

## Browser support

Browsers without native [custom element support][support] require a [polyfill][].

- Chrome
- Firefox
- Safari
- Internet Explorer 11
- Microsoft Edge

[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/custom-elements

## Development

```
npm install
npm test
```

## License

Distributed under the MIT license. See LICENSE for details.
