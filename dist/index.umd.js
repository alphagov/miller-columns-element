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

  function nodesToArray(nodes) {
    return Array.prototype.slice.call(nodes);
  }

  var Taxonomy = function () {
    function Taxonomy(taxons, millerColumns) {
      _classCallCheck(this, Taxonomy);

      this.taxons = taxons;
      this.millerColumns = millerColumns;
      this.active = this.selectedTaxons[0];
    }

    _createClass(Taxonomy, [{
      key: 'toggleSelection',
      value: function toggleSelection(taxon) {
        // if this is the active taxon or a parent of it we deselect
        if (taxon === this.active || taxon.parentOf(this.active)) {
          taxon.deselect();
          if (taxon.parent) {
            taxon.parent.select();
          }
          this.active = taxon.parent;
        } else if (taxon.selected || taxon.selectedChildren.length) {
          // if this is a selected taxon with children we make it active to allow
          // picking the children
          if (taxon.children.length) {
            this.active = taxon;
          } else {
            // otherwise we deselect it as we take the click as they can't be
            // traversing
            taxon.deselect();
            if (taxon.parent) {
              taxon.parent.select();
            }
            this.active = taxon.parent;
          }
        } else {
          // otherwise this is a new selection
          taxon.select();
          this.active = taxon;
        }

        this.millerColumns.update();
      }
    }, {
      key: 'removeTopic',
      value: function removeTopic(taxon) {
        taxon.deselect();
        // determine which topic to mark as active, if any
        this.active = this.determineActiveFromRemoved(taxon);
        this.millerColumns.update();
      }
    }, {
      key: 'determineActiveFromRemoved',
      value: function determineActiveFromRemoved(taxon) {
        // if there is already an active item with selected children lets not
        // change anything
        if (this.active && (this.active.selected || this.active.selectedChildren.length)) {
          return this.active;
        }

        // see if there is a parent with selected taxons, that feels like the most
        // natural place to end up
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = taxon.parents.reverse()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var parent = _step.value;

            if (parent.selectedChildren.length) {
              return parent;
            }
          }

          // if we've still not got one we'll go for the first selected one
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

        return this.selectedTaxons[0];
      }
    }, {
      key: 'selectedTaxons',
      get: function get() {
        return this.taxons.reduce(function (memo, taxon) {
          if (taxon.selected) {
            memo.push(taxon);
          }

          return memo.concat(taxon.selectedChildren);
        }, []);
      }
    }]);

    return Taxonomy;
  }();

  var Taxon = function () {
    _createClass(Taxon, null, [{
      key: 'fromList',
      value: function fromList(list) {
        var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var taxons = [];
        if (!list) {
          return taxons;
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = list.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;

            var label = item.querySelector('label');
            var checkbox = item.querySelector('input');
            if (label instanceof HTMLLabelElement && checkbox instanceof HTMLInputElement) {
              var childList = item.querySelector('ul');
              childList = childList instanceof HTMLUListElement ? childList : null;

              var taxon = new Taxon(label, checkbox, childList, parent);
              taxons.push(taxon);
            }
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

        return taxons;
      }
    }]);

    function Taxon(label, checkbox, childList, parent) {
      _classCallCheck(this, Taxon);

      this.label = label;
      this.checkbox = checkbox;
      this.parent = parent;
      this.children = Taxon.fromList(childList, this);

      if (!this.children.length && this.checkbox.checked) {
        this.selected = true;
        if (this.parent) {
          this.parent.childWasSelected();
        }
      }
    }

    _createClass(Taxon, [{
      key: 'parentOf',
      value: function parentOf(other) {
        if (!other) {
          return false;
        }

        return this.children.reduce(function (memo, taxon) {
          if (memo) {
            return true;
          }

          return taxon === other || taxon.parentOf(other);
        }, false);
      }
    }, {
      key: 'withParents',
      value: function withParents() {
        return this.parents.concat([this]);
      }
    }, {
      key: 'select',
      value: function select() {
        // if already selected or a child is selected do nothing
        if (this.selected || this.selectedChildren.length) {
          return;
        }
        this.selected = true;
        this.checkbox.checked = true;
        if (this.parent) {
          this.parent.childWasSelected();
        }
      }
    }, {
      key: 'deselect',
      value: function deselect() {
        if (this.selected) {
          var deepestFirst = this.withParents().reverse();

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = deepestFirst[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var taxon = _step3.value;

              // if the parent has selected children it should remain ticked
              if (taxon.selectedChildren.length) {
                break;
              } else {
                taxon.selected = false;
                taxon.checkbox.checked = false;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          return;
        }

        var selectedChildren = this.selectedChildren;
        if (selectedChildren.length) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = selectedChildren[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var child = _step4.value;

              child.deselect();
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
      }
    }, {
      key: 'childWasSelected',
      value: function childWasSelected() {
        // we need each checkbox to be selected for the UI
        this.checkbox.checked = true;
        this.selected = false;
        if (this.parent) {
          this.parent.childWasSelected();
        }
      }
    }, {
      key: 'selectedChildren',
      get: function get() {
        return this.children.reduce(function (memo, taxon) {
          var selected = taxon.selectedChildren;
          if (taxon.selected) {
            selected.push(taxon);
          }
          return memo.concat(selected);
        }, []);
      }
    }, {
      key: 'parents',
      get: function get() {
        if (this.parent) {
          return this.parent.parents.concat([this.parent]);
        } else {
          return [];
        }
      }
    }]);

    return Taxon;
  }();

  var MillerColumnsElement = function (_CustomElement2) {
    _inherits(MillerColumnsElement, _CustomElement2);

    function MillerColumnsElement() {
      _classCallCheck(this, MillerColumnsElement);

      var _this = _possibleConstructorReturn(this, (MillerColumnsElement.__proto__ || Object.getPrototypeOf(MillerColumnsElement)).call(this));

      _this.classNames = {
        column: 'govuk-miller-columns__column',
        columnCollapse: 'govuk-miller-columns__column--collapse',
        columnNarrow: 'govuk-miller-columns__column--narrow',
        item: 'govuk-miller-columns__item',
        itemParent: 'govuk-miller-columns__item--parent',
        itemSelected: 'govuk-miller-columns__item--selected',
        itemStored: 'govuk-miller-columns__item--stored'
      };
      return _this;
    }

    _createClass(MillerColumnsElement, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        var source = document.getElementById(this.getAttribute('for') || '');
        if (source) {
          this.taxonomy = new Taxonomy(Taxon.fromList(source), this);
          this.renderTaxonomyColumn(this.taxonomy.taxons, true);
          this.update();
          if (source.parentNode) {
            source.parentNode.removeChild(source);
          }
          this.style.display = 'block';
        }
      }
    }, {
      key: 'renderTaxonomyColumn',
      value: function renderTaxonomyColumn(taxons) {
        var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var ul = document.createElement('ul');
        ul.className = this.classNames.column;
        if (root) {
          ul.dataset.root = 'true';
        } else {
          ul.classList.add(this.classNames.columnCollapse);
        }
        this.appendChild(ul);
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = taxons[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var taxon = _step5.value;

            this.renderTaxon(taxon, ul);
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }
    }, {
      key: 'renderTaxon',
      value: function renderTaxon(taxon, list) {
        var li = document.createElement('li');
        li.classList.add(this.classNames.item);
        var div = document.createElement('div');
        div.className = 'govuk-checkboxes__item';
        div.appendChild(taxon.checkbox);
        div.appendChild(taxon.label);
        li.appendChild(div);
        list.appendChild(li);
        this.attachEvents(li, taxon);
        if (taxon.children.length) {
          li.classList.add(this.classNames.itemParent);
          this.renderTaxonomyColumn(taxon.children);
        }
      }
    }, {
      key: 'attachEvents',
      value: function attachEvents(trigger, taxon) {
        trigger.tabIndex = 0;
        var fn = this.selectTaxon.bind(this, taxon);
        trigger.addEventListener('click', fn, false);
      }
    }, {
      key: 'selectTaxon',
      value: function selectTaxon(taxon) {
        this.taxonomy.toggleSelection(taxon);
      }
    }, {
      key: 'update',
      value: function update() {
        this.showStoredTaxons(this.taxonomy.selectedTaxons);
        this.showActiveTaxon(this.taxonomy.active);

        if (this.selectedElement) {
          this.selectedElement.update(this.taxonomy);
        }
      }
    }, {
      key: 'showStoredTaxons',
      value: function showStoredTaxons(taxons) {
        var storedItems = this.itemsForStoredTaxons(taxons);
        var currentlyStored = nodesToArray(this.getElementsByClassName(this.classNames.itemStored));

        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = currentlyStored.concat(storedItems)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var item = _step6.value;

            if (storedItems.indexOf(item) !== -1) {
              item.classList.add(this.classNames.itemStored);
            } else {
              item.classList.remove(this.classNames.itemStored);
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }
      }
    }, {
      key: 'showActiveTaxon',
      value: function showActiveTaxon(taxon) {
        var activeItems = this.itemsForActiveTaxon(taxon);
        var currentlyActive = nodesToArray(this.getElementsByClassName(this.classNames.itemSelected));

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = currentlyActive.concat(activeItems)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var item = _step7.value;

            if (!item) {
              continue;
            }

            if (activeItems.indexOf(item) !== -1) {
              item.classList.add(this.classNames.itemSelected);
            } else {
              item.classList.remove(this.classNames.itemSelected);
            }
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }

        var allColumns = nodesToArray(this.getElementsByClassName(this.classNames.column));
        var columnsToShow = this.columnsForActiveTaxon(taxon);

        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = allColumns[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var _item = _step8.value;

            // we always want to show the root column
            if (_item.dataset.root === 'true') {
              continue;
            }
            if (columnsToShow.indexOf(_item) !== -1) {
              _item.classList.remove(this.classNames.columnCollapse);
            } else {
              _item.classList.add(this.classNames.columnCollapse);
            }
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        if (columnsToShow.length > 3) {
          // make all but the last column narrow
          for (var index = 0; index < columnsToShow.length; index++) {
            var col = columnsToShow[index];

            if (!col) {
              continue;
            }

            if (index === columnsToShow.length - 1) {
              col.classList.remove(this.classNames.columnNarrow);
            } else {
              col.classList.add(this.classNames.columnNarrow);
            }
          }
        } else {
          var _iteratorNormalCompletion9 = true;
          var _didIteratorError9 = false;
          var _iteratorError9 = undefined;

          try {
            // make sure none of the columns are narrow
            for (var _iterator9 = allColumns[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              var _col = _step9.value;

              _col.classList.remove(this.classNames.columnNarrow);
            }
          } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion9 && _iterator9.return) {
                _iterator9.return();
              }
            } finally {
              if (_didIteratorError9) {
                throw _iteratorError9;
              }
            }
          }
        }
      }
    }, {
      key: 'itemsForActiveTaxon',
      value: function itemsForActiveTaxon(taxon) {
        var _this2 = this;

        if (!taxon) {
          return [];
        }

        return taxon.withParents().reduce(function (memo, taxon) {
          var item = taxon.checkbox.closest('.' + _this2.classNames.item);
          return memo.concat([item]);
        }, []);
      }
    }, {
      key: 'itemsForStoredTaxons',
      value: function itemsForStoredTaxons(taxons) {
        var _this3 = this;

        return taxons.reduce(function (memo, child) {
          var _iteratorNormalCompletion10 = true;
          var _didIteratorError10 = false;
          var _iteratorError10 = undefined;

          try {
            for (var _iterator10 = child.withParents()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
              var taxon = _step10.value;

              var item = taxon.checkbox.closest('.' + _this3.classNames.item);
              if (item instanceof HTMLElement) {
                memo.push(item);
              }
            }
          } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion10 && _iterator10.return) {
                _iterator10.return();
              }
            } finally {
              if (_didIteratorError10) {
                throw _iteratorError10;
              }
            }
          }

          return memo;
        }, []);
      }
    }, {
      key: 'columnsForActiveTaxon',
      value: function columnsForActiveTaxon(taxon) {
        if (!taxon) {
          return [];
        }

        var columnSelector = '.' + this.classNames.column;
        var columns = taxon.withParents().reduce(function (memo, taxon) {
          var column = taxon.checkbox.closest(columnSelector);
          return memo.concat([column]);
        }, []);

        // we'll want to show the next column too
        if (taxon.children.length) {
          columns.push(taxon.children[0].checkbox.closest(columnSelector));
        }
        return columns;
      }
    }, {
      key: 'selectedElement',
      get: function get() {
        var selected = document.getElementById(this.getAttribute('selected') || '');
        return selected instanceof MillerColumnsSelectedElement ? selected : null;
      }
    }]);

    return MillerColumnsElement;
  }(_CustomElement);

  var MillerColumnsSelectedElement = function (_CustomElement3) {
    _inherits(MillerColumnsSelectedElement, _CustomElement3);

    function MillerColumnsSelectedElement() {
      _classCallCheck(this, MillerColumnsSelectedElement);

      return _possibleConstructorReturn(this, (MillerColumnsSelectedElement.__proto__ || Object.getPrototypeOf(MillerColumnsSelectedElement)).call(this));
    }

    _createClass(MillerColumnsSelectedElement, [{
      key: 'connectedCallback',
      value: function connectedCallback() {
        this.list = document.createElement('ol');
        this.list.className = 'govuk-miller-columns-selected__list';
        this.appendChild(this.list);
        if (this.millerColumnsElement && this.millerColumnsElement.taxonomy) {
          this.update(this.millerColumnsElement.taxonomy);
        }
      }
    }, {
      key: 'update',
      value: function update(taxonomy) {
        this.taxonomy = taxonomy;
        var selectedTaxons = taxonomy.selectedTaxons;
        while (this.list.lastChild) {
          this.list.removeChild(this.list.lastChild);
        }

        if (selectedTaxons.length) {
          var _iteratorNormalCompletion11 = true;
          var _didIteratorError11 = false;
          var _iteratorError11 = undefined;

          try {
            for (var _iterator11 = selectedTaxons[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
              var taxon = _step11.value;

              this.addSelectedTaxon(taxon);
            }
          } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion11 && _iterator11.return) {
                _iterator11.return();
              }
            } finally {
              if (_didIteratorError11) {
                throw _iteratorError11;
              }
            }
          }
        } else {
          var li = document.createElement('li');
          li.className = 'govuk-miller-columns-selected__list-item';
          li.textContent = 'No selected topics';
          this.list.appendChild(li);
        }
      }
    }, {
      key: 'addSelectedTaxon',
      value: function addSelectedTaxon(taxon) {
        var li = document.createElement('li');
        li.className = 'govuk-miller-columns-selected__list-item';
        li.appendChild(this.breadcrumbsElement(taxon));
        li.appendChild(this.removeTopicElement(taxon));
        this.list.appendChild(li);
      }
    }, {
      key: 'breadcrumbsElement',
      value: function breadcrumbsElement(taxon) {
        var div = document.createElement('div');
        div.className = 'govuk-breadcrumbs';
        var ol = document.createElement('ol');
        ol.className = 'govuk-breadcrumbs__list';
        var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {
          for (var _iterator12 = taxon.withParents()[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
            var current = _step12.value;

            var li = document.createElement('li');
            li.className = 'govuk-breadcrumbs__list-item';
            li.textContent = current.label.textContent;
            ol.appendChild(li);
          }
        } catch (err) {
          _didIteratorError12 = true;
          _iteratorError12 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion12 && _iterator12.return) {
              _iterator12.return();
            }
          } finally {
            if (_didIteratorError12) {
              throw _iteratorError12;
            }
          }
        }

        div.appendChild(ol);
        return div;
      }
    }, {
      key: 'removeTopicElement',
      value: function removeTopicElement(taxon) {
        var _this5 = this;

        var button = document.createElement('button');
        button.className = 'govuk-miller-columns-selected__remove-topic';
        button.textContent = 'Remove topic';
        button.addEventListener('click', function () {
          if (_this5.taxonomy) {
            _this5.taxonomy.removeTopic(taxon);
          }
        });
        return button;
      }
    }, {
      key: 'millerColumnsElement',
      get: function get() {
        var millerColumns = document.getElementById(this.getAttribute('for') || '');
        return millerColumns instanceof MillerColumnsElement ? millerColumns : null;
      }
    }]);

    return MillerColumnsSelectedElement;
  }(_CustomElement);

  if (!window.customElements.get('govuk-miller-columns')) {
    window.MillerColumnsElement = MillerColumnsElement;
    window.customElements.define('govuk-miller-columns', MillerColumnsElement);
  }

  if (!window.customElements.get('govuk-miller-columns-selected')) {
    window.MillerColumnsSelectedElement = MillerColumnsSelectedElement;
    window.customElements.define('govuk-miller-columns-selected', MillerColumnsSelectedElement);
  }

  exports.MillerColumnsElement = MillerColumnsElement;
  exports.MillerColumnsSelectedElement = MillerColumnsSelectedElement;
});
