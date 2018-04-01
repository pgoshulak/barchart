function createTitle (titleText) {
  return $('<h4></h4>').text(titleText).addClass('grid-title');
}

/** Find the maximum value to be displayed */
function getMaxDataVal (data) {
  var maxVal = 0;
  data.forEach(function(entry) {
    // Check single-bar columns
    if (entry.value > maxVal) {
      maxVal = entry.value;

    } else if (entry.multiValues) {
      // Check multi-bar columns
      totalColumnVal = 0;
      entry.multiValues.forEach(function(singleEntry) {
        totalColumnVal += singleEntry.value;
      });
      if (totalColumnVal > maxVal) {
        maxVal = totalColumnVal;
      }
    }
  });
  return maxVal;
}

function getDataScaleFactor (maxDataVal) {
  // Scale data to fit to 100 rows
  return 100.0 / maxDataVal;
}

/** Create a single bar of data
 *
 */
function createSingleDataBar (dataEntry, gridPoints) {
  var dataBar = $('<div></div>')
  .addClass('grid-data')
  // .css('gridRowStart', Math.floor(startPoint.gridRow - (entry.value * dataScaleFactor)).toString())
  // .css('gridRowEnd', (startPoint.gridRow).toString())
  // .css('gridColumn', startPoint.gridColumn + '/' + (startPoint.gridColumn + 1))
  .css('gridRowStart', gridPoints.rowTop.toString())
  .css('gridRowEnd', gridPoints.rowBottom.toString())
  .css('gridColumn', gridPoints.column + '/' + (gridPoints.column + 1))
  ;
  if (dataEntry.color) {
    dataBar.css('backgroundColor', dataEntry.color);
  }
  return dataBar;
}

/** Create the data column
 *
 */
function createDataColumn (entry, gridColumn, dataScaleFactor) {
  // Initialize points on CSS-grid to draw bar
  var gridPoints = {
    column: gridColumn,
    rowBottom: 101,
    rowTop: null
  };
  // If this is a single-bar data entry
  if (entry.value) {
    // Calculate top row in CSS-grid (ie. value of data)
    gridPoints.rowTop = Math.floor(101.0 - entry.value * dataScaleFactor);
    return createSingleDataBar(entry, gridPoints);
    
  } else if (entry.multiValues) {
    // Else: this is a multi-bar data entry
    var allDataBars = [];
    for (var i = 0; i < entry.multiValues.length; i++) {
      singleEntry = entry.multiValues[i];
      // Calculate top row in CSS-grid (takes into account previous data points)
      gridPoints.rowTop = Math.round(gridPoints.rowBottom - singleEntry.value * dataScaleFactor);
      // Generate the data bar and add it to the list
      allDataBars.push(createSingleDataBar(singleEntry, gridPoints));
      // Assign the bottom of next bar as the top of the current bar (to stack)
      gridPoints.rowBottom = gridPoints.rowTop;
    }
    return allDataBars;
  }
}

/** Create x-axis data label
 *
 */
function createLabelX (entry, gridColumnNum) {
  var label = $('<div></div>')
    .addClass('grid-label-x')
    .text(entry.columnLabel)
    .css('gridRowStart', (101).toString())
    .css('gridRowEnd', (102).toString())
    .css('gridColumn', gridColumnNum + '/' + (gridColumnNum + 1))
    ;
  return label;
}

/** Create y-axis grid lines and labels
 *
 */
function createGridlinesAndLabelsY (spacing, scale) {
  var numLines = Math.floor(100.0 / (spacing * scale));
  var gridlines = [];
  
  for (var i = 0; i <= numLines; i++) {
    // Convert data value to CSS-grid row
    var row = Math.floor(101.0 - (i * spacing * scale));
    var gridline = $('<div></div>')
      .addClass('grid-line')
      .css('gridRow', row + ' / ' + row)
      .css('gridColumn', '1 / -1')
      ;
    gridlines.push(gridline);

    var dataLabelY = $('<div></div>')
      .addClass('grid-label-y')
      .text(i * spacing)
      .css('gridRow', row + ' / ' + row)
      .css('gridColumn', '1 / 2')
      ;
    gridlines.push(dataLabelY);
  }
  return gridlines;
}

/** Create y-axis
 *
 */
function createAxisY () {
  var axisY = $('<div></div>')
    .addClass('grid-axis-y')
    .css('gridRow', '1 / -2')
    .css('gridColumn', '1 / 2')
    ;

  return axisY;
}

/** Draw the chart area
 *
 */
function createChartArea (data, options) {
  // Create grid container
  var chartArea = $('<div></div>')
    .addClass('grid-chart-area')
    .css('grid-template-columns', 'auto repeat(' + data.length + ', 1fr) 0')
    ;
  // Create string for CSS-grid property 'grid-template-columns: auto auto auto...'
  var maxVal = getMaxDataVal(data);
  var dataScaleFactor = getDataScaleFactor(maxVal);

  // Add y-axis
  var axisY = createAxisY();
  chartArea.append(axisY);

  // Add each data entry
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    var gridColumnNum = i + 2;
    // Construct the column and label
    column = createDataColumn(entry, gridColumnNum, dataScaleFactor);
    label = createLabelX(entry, gridColumnNum);

    chartArea.append(column, label);
  }
  
  // Write the grid lines;
  var gridlines = createGridlinesAndLabelsY(options.gridlineSpacingY, dataScaleFactor);
  chartArea.append(gridlines);

  return chartArea;
}

function barchart(data, options, element) {
  var titleElem = createTitle(options.title);
  var chartElem = createChartArea(data, options);
  if (options.titlePosition === 'top') {
    $('#' + element).append(titleElem, chartElem);
  } else {
    $('#' + element).append(chartElem, titleElem);
  }
}