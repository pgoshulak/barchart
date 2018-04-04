# About
An experimental barchart constructed from JS/JQuery, using CSS Grid. It is a simple embeddable package which provides many options for displaying basic and stackable bar charts.
This project began as an assignment for the Lighthouse Labs bootcamp's Web Development prep course. 

# Screenshots

# Usage
## Setup
Simply save `barchart.js` and `barchart.css` into your project to install the necessary files.
Call the `barchart(data, options, element)` function from within any `<script>` tag and the chart will render to the DOM element specified.


## Parameters
### Chart `data`
`data` must be given as an array of data objects, each object representing a single column of data. 

Each data object within the array has the following properties:
- `columnLabel` (String): Label to be applied under the column (x-axis)

To create a simple bar (only one value), use the following properties:
- `value` (Integer/Float): the data amount
- `color` (String, *optional, default `#F0A`*): the bar's color. Can be given as hex value (eg. `'#FA0'`), HTML color name (eg. `'red'`), `'rgba()'`, `'hsla()'`, etc
- `description` (String, *optional*): the text displayed inside the bar (mostly used for multi-bar columns)

To create a multi-bar column (ie. stacked bars), substitute the above `value` property for the following:

- `multiValues` (Array): ordered array (bottom to top) of data objects. Each object in the array uses the same properties as above, ie. `value`, `color`, and `description`. It is recommended to use different colors and give descriptions to help distinguish your data.

Chart axes are automatically generated based on the data given (ie. number of columns, maximum value)



### Chart `options`
Display options are specific as a single object

### Chart `element`
Id of the element where the chart will be rendered
ie. `element = 'barchart-1'` will render to `<div #barchart-1>`

# Issues

# Roadmap
- custom chart element sizing
- scale data to 100% chart height
- build-step minification for distribution

# External Resources Consulted
- http://learn.jquery.com
- https://www.w3schools.com/css/css_grid.asp
- https://css-tricks.com/things-ive-learned-css-grid-layout/
- https://www.w3schools.com/cssref/css_units.asp