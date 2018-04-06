var GRID_ROW_BOTTOM = 101.0;

function createTitle (titleText) {
  return $('<h4></h4>').text(titleText).addClass('grid-title');
}

/** Find the maximum value to be displayed */
function getMaxDataVal (data) {
  var maxDataVal = 0;
  data.forEach(function(entry) {
    // Check single-bar columns
    if (entry.value > maxDataVal) {
      maxDataVal = entry.value;

    } else if (entry.multiValues) {
      // Check multi-bar columns
      totalColumnVal = 0;
      entry.multiValues.forEach(function(singleEntry) {
        totalColumnVal += singleEntry.value;
      });
      if (totalColumnVal > maxDataVal) {
        maxDataVal = totalColumnVal;
      }
    }
  });
  return maxDataVal;
}

/** Find the maximum chart y-axis value (ensure data fits on chart) */
function getMaxChartVal (maxDataVal, gridlineSpacingY) {
  return (Math.floor(maxDataVal / gridlineSpacingY) + 1) * gridlineSpacingY;
}

/** Find conversion factor for data -> CSS grid rows */
function getDataScaleFactor (maxChartVal) {
  // Scale data to fit to 100 rows
  return 100.0 / maxChartVal;
}

/** Create a single bar of data */
function createSingleDataBar (dataEntry, gridPoints) {
  var dataBar = $('<div></div>')
    .addClass('grid-data')
    .css('gridRowStart', gridPoints.rowTop.toString())
    .css('gridRowEnd', gridPoints.rowBottom.toString())
    .css('gridColumn', gridPoints.column + '/' + (gridPoints.column + 1))
    ;
  if (dataEntry.color) {
    dataBar.css('backgroundColor', dataEntry.color);
  }
  var dataLabel = $('<div></div>').addClass('grid-data-value-label').text(dataEntry.value);

  
  var dataLabelContainer = $('<div></div>')
  .addClass('grid-data-label-container')
  .append(dataLabel)
  ;
  
  if (dataEntry.description) {
    var dataDescription = $('<div></div>')
      .addClass('grid-data-description')
      .text(dataEntry.description);
    dataLabelContainer.append(dataDescription);
  }

  dataBar.append(dataLabelContainer);

  return dataBar;
}

/** Create the data column */
function createDataColumn (entry, gridColumn, dataScaleFactor) {
  // Initialize points on CSS-grid to draw bar
  var gridPoints = {
    column: gridColumn,
    rowBottom: GRID_ROW_BOTTOM,
    rowTop: null
  };
  var valueTop = 0;
  var valueBottom = 0;

  // If this is a single-bar data entry
  if (entry.value) {
    // Calculate top row in CSS-grid (ie. value of data)
    gridPoints.rowTop = Math.round(GRID_ROW_BOTTOM - entry.value * dataScaleFactor);
    return createSingleDataBar(entry, gridPoints);
    
  } else if (entry.multiValues) {
    // Else: this is a multi-bar data entry
    var allDataBars = [];
    for (var i = 0; i < entry.multiValues.length; i++) {
      singleEntry = entry.multiValues[i];
      // Set new bottom as old top (ie. stack this bar above prev bar)
      valueBottom = valueTop;
      // Calculate top (endpoint) of new bar
      valueTop += singleEntry.value;
      // Calculate rows in CSS-grid (takes into account previous data points)
      gridPoints.rowTop = Math.round(GRID_ROW_BOTTOM - valueTop * dataScaleFactor);
      gridPoints.rowBottom = Math.round(GRID_ROW_BOTTOM - valueBottom * dataScaleFactor);
      // Generate the data bar and add it to the list
      allDataBars.push(createSingleDataBar(singleEntry, gridPoints));
      // Assign the bottom of next bar as the top of the current bar (to stack)
    }
    return allDataBars;
  }
}

/** Create x-axis data labels */
function createLabelX (entry, gridColumnNum) {
  var label = $('<div></div>')
    .addClass('grid-label-x')
    .text(entry.columnLabel)
    .css('gridRowStart', (GRID_ROW_BOTTOM).toString())
    .css('gridRowEnd', (GRID_ROW_BOTTOM + 1).toString())
    .css('gridColumn', gridColumnNum + '/' + (gridColumnNum + 1))
    ;
  return label;
}

/** Create y-axis grid lines and labels */
function createGridlinesAndLabelsY (spacing, scale) {
  // Number of lines to create
  var numLines = Math.floor(100.0 / (spacing * scale));
  var gridlines = [];
  
  for (var i = 0; i <= numLines; i++) {
    // Convert data value to CSS-grid row
    var row = Math.round(GRID_ROW_BOTTOM - (i * spacing * scale));

    // Create horizontal gridlines
    var gridline = $('<div></div>')
      .addClass('grid-line')
      .css('gridRow', row + ' / ' + row)
      .css('gridColumn', '2 / -1')
      ;
    gridlines.push(gridline);

    // Create y-axis value labels
    var gridLabelY = $('<div></div>')
      .addClass('grid-label-y')
      .text((i * spacing).toFixed(0))
      .css('gridRow', row + ' / ' + row)
      .css('gridColumn', '1 / 2')
      ;
    gridlines.push(gridLabelY);
  }
  return gridlines;
}

/** Create y-axis */
function createAxisY () {
  var axisY = $('<div></div>')
    .addClass('grid-axis-y')
    .css('gridRow', '1 / -2')
    .css('gridColumn', '2 / 3')
    ;

  return axisY;
}

/** Draw the chart area */
function createChartArea (data, options) {
  
  // Create grid container
  var chartArea = $('<div></div>')
  .addClass('grid-chart-area')
  .css('grid-template-columns', 'auto 0 repeat(' + data.length + ', 1fr) 0')
  ;
  /* CSS-grid columns are as follows:
  - auto: y-axis labels
  - 0: zero-width buffer column, allows y-axis ticks to extend, without overlapping labels
  - repeat(): each data column, width 1fr (auto-fraction)
  - 0: zero-width buffer column, allows x-axis to extend past final data bar
  */

  // Create string for CSS-grid property 'grid-template-columns: auto auto auto...'
  var maxDataVal = getMaxDataVal(data);
  // Error-checking gridline spacing
  var gridlineSpacingYClean;
  if (!options.gridlineSpacingY) {
    gridlineSpacingYClean = maxDataVal * 1.1;
  } else {
    gridlineSpacingYClean = options.gridlineSpacingY;
  }
  var maxChartVal = getMaxChartVal(maxDataVal, gridlineSpacingYClean);
  var dataScaleFactor = getDataScaleFactor(maxChartVal);

  // Add y-axis
  var axisY = createAxisY();
  chartArea.append(axisY);

  // Add each data entry
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    // Assign starting CSS-grid column (+3 for label and axis; 1-based counting)
    var gridColumnNum = i + 3;
    // Construct the column and label
    column = createDataColumn(entry, gridColumnNum, dataScaleFactor);
    label = createLabelX(entry, gridColumnNum);

    chartArea.append(column, label);
  }
  
  // Write the grid lines;
  var gridlines = createGridlinesAndLabelsY(gridlineSpacingYClean, dataScaleFactor);
  chartArea.append(gridlines);

  return chartArea;
}

/** Write additional CSS rules from 'options' object */
function createAdditionalCss (options, element) {
  var css = $('<style type="text/css"></style>');
  var rootElement = ' #' + element + ' ';
  // List of extra CSS rules to apply (each prefixed with rootElement to specify *this* chart)
  // Note: array begins with '' to allow array.join() to result with rootElement as start
  var additionalCss = [''];

  // Align data-labels vertically (default: start, ie. top)
  if (options.dataLabelVerticalAlign === 'center') {
    additionalCss.push('.grid-data { align-items: center; }');
  } else if (options.dataLabelVerticalAlign === 'bottom') {
    additionalCss.push('.grid-data { align-items: end; }');
  }

  // Set width of gap between bars (default: 10px)
  if (options.barSpacing) {
    additionalCss.push('.grid-data { margin: 0 ' + options.barSpacing + '; }');
  }

  // Show/hide data value labels (default: true, ie. show)
  if (options.showDataValueLabels === false) {
    additionalCss.push('.grid-data-value-label { display: none }');
  }

  // Show/hide data value labels (default: true, ie. show)
  if (options.showDataDescriptions === false) {
    additionalCss.push('.grid-data-description { display: none }');
  }

  // Change data label font color (default: #222)
  if (options.dataLabelFontColor) {
    additionalCss.push('.grid-data-label { color: ' + options.dataLabelFontColor + ' }');
  }

  // Change data label background color (default: rgba(255,255,255,0.2))
  if (options.dataLabelBgColor) {
    additionalCss.push('.grid-data-label { background-color: ' + options.dataLabelBgColor + ' }');
  }

  // Change chart title font color (default: #222)
  if (options.titleFontColor) {
    additionalCss.push('.grid-title { color: ' + options.titleFontColor + ' }');
  }

  // Change chart title font size (default: 24px)
  if (options.titleFontSize) {
    additionalCss.push('.grid-title { font-size: ' + options.titleFontSize + ' }');
  }

  css.html(additionalCss.join(rootElement));
  return css;
}

function barchart(data, options, element) {
  var titleElem = createTitle(options.title);
  var chartElem = createChartArea(data, options);
  if (options.titlePosition === 'bottom') {
    $('#' + element).append(chartElem, titleElem);
  } else {
    $('#' + element).append(titleElem, chartElem);
  }
  $('head').append(createAdditionalCss(options, element));
}