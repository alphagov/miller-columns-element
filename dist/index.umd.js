(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.index = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _CustomElement() {
    return Reflect.construct(HTMLElement, [], this.__proto__.constructor);
  }

  ;
  Object.setPrototypeOf(_CustomElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(_CustomElement, HTMLElement);

  var MillerColumnsElement = function (_CustomElement2) {
    _inherits(MillerColumnsElement, _CustomElement2);

    function MillerColumnsElement() {
      _classCallCheck(this, MillerColumnsElement);

      return _possibleConstructorReturn(this, (MillerColumnsElement.__proto__ || Object.getPrototypeOf(MillerColumnsElement)).call(this));
    }

    _createClass(MillerColumnsElement, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        var list = this.list;
        // const breadcrumbs = this.breadcrumbs
        if (list) {
          this.attachClickEvents(list);
          this.unnest(list);
          // this.updateBreadcrumbs(breadcrumbs)
        }
      }
    }, {
      key: 'disconnectedCallback',
      value: function disconnectedCallback() {}
    }, {
      key: 'unnest',
      value: function unnest(root) {
        var millercolumns = this;

        var queue = [];
        var node = void 0;
        var listItems = void 0;
        var depth = 1;

        // Push the root unordered list item into the queue.
        root.className = 'app-miller-columns__column';
        root.dataset.level = '1';
        queue.push(root);

        while (queue.length) {
          node = queue.shift();

          if (node.children) {
            listItems = node.children;

            for (var i = 0; i < listItems.length; i++) {
              var child = listItems[i].querySelector('ul');
              var ancestor = listItems[i];

              if (child) {
                // Store level and depth
                var level = parseInt(node.dataset.level) + 1;
                child.dataset.level = level.toString();
                if (level > depth) depth = level;

                queue.push(child);

                // Mark list items with child lists as parents.
                if (ancestor) {
                  ancestor.dataset['parent'] = 'true';
                  ancestor.className = 'app-miller-columns__item--parent';

                  // Expand the requested child node on click.
                  var fn = this.revealColumn.bind(null, this, ancestor, child);
                  ancestor.addEventListener('click', fn, false);
                }

                // Hide columns.
                child.className = 'app-miller-columns__column app-miller-columns__column--collapse';
                // Causes item siblings to have a flattened DOM lineage.
                millercolumns.insertAdjacentElement('beforeend', child);
              }
            }
          }
        }

        root.dataset['depth'] = depth.toString();
      }
    }, {
      key: 'attachClickEvents',
      value: function attachClickEvents(root) {
        var items = root.querySelectorAll('li');

        for (var i = 0; i < items.length; i++) {
          var fn = this.selectItem.bind(null, this, items[i]);
          items[i].addEventListener('click', fn, false);
        }
      }
    }, {
      key: 'selectItem',
      value: function selectItem(millercolumns, item) {
        item.classList.toggle('app-miller-columns__item--selected');

        millercolumns.updateBreadcrumbs(millercolumns);
      }
    }, {
      key: 'revealColumn',
      value: function revealColumn(millercolumns, item, column) {
        millercolumns.hideColumns(millercolumns, column.dataset.level);
        if (item.classList.contains('app-miller-columns__item--selected')) {
          column.classList.remove('app-miller-columns__column--collapse');
        }
      }
    }, {
      key: 'hideColumns',
      value: function hideColumns(millercolumns, level) {
        var levelInt = parseInt(level);
        var selectors = [];

        // TODO: use depth instead of constant
        for (var i = levelInt; i <= 5; i++) {
          selectors.push('[data-level=\'' + i.toString() + '\']');
        }

        var lists = millercolumns.querySelectorAll(selectors.join(', '));
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            item.classList.add('app-miller-columns__column--collapse');
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: 'updateBreadcrumbs',
      value: function updateBreadcrumbs(millercolumns) {
        var chain = this.getActiveChain(millercolumns);
        var breadcrumbs = millercolumns.breadcrumbs;

        if (breadcrumbs) {
          breadcrumbs.innerHTML = '';

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = chain[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var item = _step2.value;

              var breadcrumb = document.createElement('li');
              breadcrumb.innerHTML = item.innerHTML;
              breadcrumb.classList.add('govuk-breadcrumbs__list-item');
              breadcrumbs.appendChild(breadcrumb);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      }
    }, {
      key: 'getActiveChain',
      value: function getActiveChain(millercolumns) {
        return millercolumns.querySelectorAll('.app-miller-columns__item--selected');
      }
    }, {
      key: 'list',
      get: function get() {
        var id = this.getAttribute('for');
        if (!id) return;
        var list = document.getElementById(id);
        return list instanceof HTMLUListElement ? list : null;
      }
    }, {
      key: 'breadcrumbs',
      get: function get() {
        var id = this.getAttribute('breadcrumbs');
        if (!id) return;
        var breadcrumbs = document.getElementById(id);
        return breadcrumbs instanceof HTMLOListElement ? breadcrumbs : null;
      }
    }]);

    return MillerColumnsElement;
  }(_CustomElement);

  if (!window.customElements.get('govuk-miller-columns')) {
    window.MillerColumnsElement = MillerColumnsElement;
    window.customElements.define('govuk-miller-columns', MillerColumnsElement);
  }

  exports.default = MillerColumnsElement;
});
