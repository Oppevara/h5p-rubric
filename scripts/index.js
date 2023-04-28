/**
 * Rubric Content Type
 */

var H5P = H5P || {};

/**
 * Music Composition Exercises module
 * @param  {H5P.jQuery} $ jQuery used by H5P Core
 * @return {function}   Rubric constructor
 */
H5P.Rubric = (function ($, JoubelUI) {
  /**
   * Rubric constructor
   * @param       {object} options Object with current data and configurations
   * @param       {integer} id      Unique identifier
   * @constructor
   */
  function Rubric(options, id) {
    this.options = options;
    this.id = id;
    this.l10n = $.extend({
      'downloadResponses': 'Download responses',
      'clickToSelect': 'Click to select',
      'evidencePlaceholder': 'Evidence',
      'evidenceTitle': 'Provide evidence URL or text'
    }, options.l10n !== undefined ? options.l10n : {});
  }

  /**
   * Tries to find element within an array.
   * Uses native Array.find, if available.
   * Uses abstract comparsion operator (e.g. ==).
   * @param  {array} elements An array ob objects
   * @param  {mixed} key      Key to use for comparison
   * @param  {mixed} value    Value to use for comparison
   * @return {object}         Element or undefined
   */
  Rubric.prototype._find = function (elements, key, value) {
    if (!(elements && elements.length > 0)) {
      return undefined;
    }

    if (typeof elements.find === 'function') {
      return elements.find(function (element) {
        return element[key] == value;
      });
    }

    for (var i = 0; i < elements.length; i++) {
      if (elements[i][key] == value) {
        return elements[i];
      }
    }

    return undefined;
  };

  /**
   * Returns title
   * @return {string} Title text
   */
  Rubric.prototype.getTitle = function () {
    return this.options.title;
  };

  /**
   * Returns description
   * @return {string} Description text
   */
  Rubric.prototype.getDescription = function () {
    return this.options.description;
  };

  /**
   * Checks if description is set and not empty
   * @return {boolean} Description is set or not
   */
  Rubric.prototype.hasDescription = function () {
    var description = this.getDescription() || '';
    description = description.trim();

    return description && description.length > 0;
  };

  /**
   * Determines if grid is available
   * @return {boolean} Grid object is available
   */
  Rubric.prototype.hasGrid = function () {
    return Object.prototype.hasOwnProperty.call(this.options, 'grid') && typeof this.options.grid === 'object';
  };

  /**
   * Returns grid
   * @return {object} Grid object
   */
  Rubric.prototype.getGrid = function () {
    return this.options.grid;
  };

  /**
   * Returns grid rows
   * @return {array} Grid rows array
   */
  Rubric.prototype.getGridRows = function () {
    return (this.hasGrid() && Object.prototype.hasOwnProperty.call(this.getGrid(), 'rows') && typeof this.getGrid().rows === 'object') ? this.getGrid().rows : [];
  };

  /**
   * Returns grid columns
   * @return {array} Grid columns array
   */
  Rubric.prototype.getGridColumns = function () {
    return (this.hasGrid() && Object.prototype.hasOwnProperty.call(this.getGrid(), 'columns') && typeof this.getGrid().columns === 'object') ? this.getGrid().columns : [];
  };

  /**
   * Callback, finds and selects grid row column element (deselects any previously selected)
   * @param  {object} row    Row object
   * @param  {object} column Column object
   * @return {void}
   */
  Rubric.prototype.selectGridRowColumn = function (row, column) {
    this.$container.find('table.h5p-rubric-grid > tbody > tr[data-id="' + row.rowId + '"] > td.selected').removeClass('selected');
    this.$container.find('table.h5p-rubric-grid > tbody > tr[data-id="' + row.rowId + '"] > td[data-id="' + column.columnId + '"]').addClass('selected');
  };

  /**
   * Returns text for columns within a row
   * @param  {object} row     Row object
   * @param  {object} column Column object
   * @return {string}        Value or an empty string
   */
  Rubric.prototype.getRowColumnText = function (row, column) {
    var text = '';

    if (row && Object.prototype.hasOwnProperty.call(row, 'columns') && row.columns.length > 0) {
      var found = this._find(row.columns, 'columnId', column.columnId);

      if (found && Object.prototype.hasOwnProperty.call(found, 'text')) {
        return found.text;
      }
    }

    return text;
  };

  /**
   * Generated grid table
   * @return {object} DOM Node
   */
  Rubric.prototype.generateGridTable = function () {
    var self = this;
    var rows = self.getGridRows();
    var columns = self.getGridColumns();
    var table = $('<table>', {
      'class': 'h5p-rubric-grid'
    }).append(
      $('<thead>').append(
        $('<tr>').append(
          $('<th>')
        )
      )
    ).append('<tbody>');

    $.each(columns, function (index, column) {
      $('<th>', {
        'class': 'gird-column',
        'data-id': column.columnId,
        'text': column.columnText
      }).appendTo(table.find('thead > tr'));
    });

    $.each(rows, function (index, row) {
      var tr = $('<tr>', {
        'class': 'grid-row',
        'data-id': row.rowId,
      }).append($('<td>').append($('<div>', {
        'text': row.rowText
      }).append($('<input>', {
        'type': 'text',
        'value': '',
        'placeholder': self.l10n.evidencePlaceholder,
        'title': self.l10n.evidenceTitle,
        'class': 'grid-row-evidence',
        'tabindex': '0'
      }))));

      $.each(columns, function (index, column) {
        $('<td>', {
          'class': 'grid-row-column',
          'data-row-id': row.rowId,
          'data-id': column.columnId,
          'title': self.l10n.clickToSelect,
          'tabindex': '0'
        }).append($('<div>', {
          'text': self.getRowColumnText(row, column)
        })).on('click', function () {
          self.selectGridRowColumn(row, column);
        }).on('keypress', function (event) {
          if (event.which === 32 || event.which === 13) {
            event.preventDefault();
            self.selectGridRowColumn(row, column);
          }
        }).appendTo(tr);
      });

      tr.appendTo(table.find('tbody'));
    });

    return table;
  };


  /**
   * Returns column text
   * @param  {string} id Column id
   * @return {string}    Value or an empty string
   */
  Rubric.prototype.getColumnText = function (id) {
    var text = '';

    var column = this._find(this.getGridColumns(), 'columnId', id);

    if (column && Object.prototype.hasOwnProperty.call(column, 'columnText')) {
      text = column.columnText;
    }

    return text;
  };

  /**
   * Trigger download of CSV file with textual data
   * @return {void}
   */
  Rubric.prototype.downloadResponses = function () {
    var self = this;
    var data = [];

    // Criteria/Topic + Column Heading + Column value + Evidence
    self.$gridTable.find('tbody > tr.grid-row').each(function () {
      var rowElement = $(this);
      var dataRow = [rowElement.find('td:first-child').text()];
      var selectedRowColumn = rowElement.find('td.grid-row-column.selected').get(0);

      if (selectedRowColumn) {
        dataRow.push(self.getColumnText($(selectedRowColumn).data('id')));
        dataRow.push($(selectedRowColumn).text());
      }
      else {
        dataRow.push('');
        dataRow.push('');
      }

      dataRow.push($('input.grid-row-evidence', rowElement).val());

      data.push(dataRow);
    });

    window.saveAs(new Blob([window.Papa.unparse(data)], {type: 'text/csv;charset=utf-8'}), 'rubric-' + this.id + '-responses.csv');
  };

  /**
   * Creates and fills container with content
   * @param  {object} $container Container node
   * @return {void}
   */
  Rubric.prototype.attach = function ($container) {
    var self = this;
    var $content = $('<div>', {
      'class': 'h5p-rubric-content',
    }).appendTo($container);
    self.$container = $container;

    $container.addClass('h5p-rubric');
    $('<h3>', {
      'class': 'h5p-rubric-title',
      'text': self.getTitle()
    }).appendTo($content);

    if (self.hasDescription()) {
      $('<div>', {
        'class': 'h5p-rubric-description',
        'html': self.getDescription()
      }).appendTo($content);
    }

    if (self.hasGrid()) {
      self.$responsiveContainer = $('<div>', {
        'class': 'h5p-rubric-responsive',
        'tabindex': '-1'
      }).appendTo($content);
      self.$gridTable = self.generateGridTable().appendTo(self.$responsiveContainer);

      JoubelUI.createButton({
        'class': 'h5p-rubric-download-responses',
        'html': self.l10n.downloadResponses,
        'on': {
          click: function () {
            self.downloadResponses();
          }
        },
        'appendTo': $content
      });
    }
  };

  return Rubric;
})(H5P.jQuery, H5P.JoubelUI);
