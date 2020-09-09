# Changelog

- We use [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
- Mark breaking changes with `BREAKING:`. Be sure to include instructions on
  how applications should be upgraded.
- Include a link to your pull request.
- Don't include changes that are purely internal. The CHANGELOG should be a
  useful summary for people upgrading their application, not a replication
  of the commit log.

## 2.0.0

- BREAKING: govuk-frontend classes are no longer bundled with this module, apps using this are expected to already be using `govuk-frontend` (PR #97)

## 1.3.2

- Fix back-link styles by updating miller-columns-element to `govuk-frontend` 3.7 (PR #75)

## 1.3.1

- Ensure checkboxes are focusable without JS (PR #35)

## 1.3.0

- Fix active column on root taxons (PR #30)
- Enable keyboard navigation (PR #31)
- Enable navigation instructions for assistive technologies (PR #32)

## 1.2.1

- Improve remove action for screen readers (PR #28)

## 1.2.0

- Enhance mobile view (PR #25)
- Update miller-columns-element to `govuk-frontend` 3.3 (PR #25)

## 1.1.0

- Update miller-columns-element to `govuk-frontend` 3.2 (PR #23)

## 1.0.0

- Trigger click event on checkboxes when selecting an item in the MillerColumnsElement (PR #16)
- BREAKING: Remove `selectedTopicNames` as we don't need this API method for analytics anymore (PR #17)

## 0.1.1

- Scope pointer events on checkboxes to the miller-columns element (PR #14)
- Trigger remove-topic event on MillerColumnsSelectedElement (PR #15)

## 0.1.0

- Initial release
