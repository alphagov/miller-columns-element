# &lt;miller-columns&gt; element

Express a hierarchy by showing selectable lists of the items in each hierarchy level.

Selection of any item shows that item’s children in the next list.

## Installation

```
npm install --save miller-columns-element
```

## Usage

This element is expected to be used in an application with [govuk-frontend](https://github.com/alphagov/govuk-frontend) installed. The expected CSS dependencies are outlined in [examples.scss](./examples.scss).

```html
<p id="navigation-instructions" class="govuk-body govuk-visually-hidden">
  Use the right arrow to explore sub-topics, use the up and down arrows to find other topics.
</p>

<miller-columns-selected id="selected-items" for="miller-columns" class="miller-columns-selected"></miller-columns-selected>

<miller-columns class="miller-columns" for="taxonomy" selected="selected-items" id="miller-columns" aria-describedby="navigation-instructions">
  <ul id="taxonomy">
    <li>
      <input class="govuk-checkboxes__input" type="checkbox" id="parenting-childcare-and-children-s-services">
      <label class="govuk-label govuk-checkboxes__label" for="parenting-childcare-and-children-s-services">
        Parenting, childcare and children's services
      </label>
      <ul>
        <li>
          <input class="govuk-checkboxes__input" type="checkbox" id="divorce-separation-and-legal-issues">
          <label class="govuk-label govuk-checkboxes__label" for="divorce-separation-and-legal-issues">
            Divorce, separation and legal issues
          </label>
        </li>
        <li>
          <input class="govuk-checkboxes__input" type="checkbox" id="childcare-and-early-years">
          <label class="govuk-label govuk-checkboxes__label" for="childcare-and-early-years">
            Childcare and early years
          </label>
        </li>
      </ul>
    </li>
  </ul>
</miller-columns>
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

To continuously build files while developing run:

```
npm run watch
```

To install and run a local HTTP server using Node.js:

```
npm install -g http-server
http-server
```

To manually check examples in a web browser or using BrowserStack:

- `http://127.0.0.1:8080/examples/index.html` (default example)
- `http://127.0.0.1:8080/examples/checkboxes-checked.html` (with pre-selected items at page load)
- `http://127.0.0.1:8080/examples/miller-columns-test.html` (example used for tests)

Alternatively, you can open one of the HTML files in the [`/examples`](https://github.com/alphagov/miller-columns-element/tree/master/examples) directory for a quick preview.

## License

Distributed under the MIT license. See LICENSE for details.
