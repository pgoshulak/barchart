var basic = `barchart([
    {
      columnLabel: 'Apples',
      value: 22
    },
    {
      columnLabel: 'Bananas',
      value: 31
    },
    {
      columnLabel: 'Cherries',
      value: 27
    },
    {
      columnLabel: 'Durian',
      value: 15
    }  
  ], {
    title: 'Basic Barchart',
    gridlineSpacingY: 5,
  }, 'barchart-basic');`

var colored = `barchart([
    {
      columnLabel: 'Aquaman',
      value: 15,
      color: 'orange'
    },
    {
      columnLabel: 'Batman',
      value: 53,
      color: '#05A'
    },
    {
      columnLabel: 'Captain America',
      value: 45,
      color: 'rgb(255,0,0)'
    },  
  ], {
    title: 'Colored Barchart',
    titleFontColor: 'hsl(128,100%,40%)',
    gridlineSpacingY: 10,
    dataLabelVerticalAlign: 'bottom'
  }, 'barchart-colored');`

var multi = `barchart([
    {
      columnLabel: 'Germanic',
      multiValues: [
        {
          value: 5,
          description: 'English'
        },
        {
          value: 3,
          color: '#FA0',
          description: 'German'
        }
      ]
    },
    {
      columnLabel: 'Romantic',
      multiValues: [
        {
          value: 2,
          description: 'French'
        },
        {
          value: 1,
          color: '#0FA',
          description: 'Italian'
        },
        {
          value: 3,
          color: '#FA0',
          description: 'Spanish'
        }
      ]
    },
    {
      columnLabel: 'Made-up',
      value: 3,
      description: 'Pig Latin'
    }
  ], {
    title: 'Multi-bar chart',
    dataLabelVerticalAlign: 'center',
  }, 'barchart-multi');`


var full = `barchart([{
    columnLabel: 'Alpha',
    value: 1
  },
  {
    columnLabel: 'Bravo',
    multiValues: [{
      value: 1,
      color: '#0FA',
      description: 'I am green'
    },
    {
      value: 1,
      color: '#A0F',
      description: 'Je suis violet'
    },
    {
      value: 1,
      color: '#FA0',
      description: 'Ich bin gelb'
    }
    ]
  },
  {
    columnLabel: 'Charlie',
    value: 6,
    color: '#0AF',
    description: 'Sono azuro'
  },
  {
    columnLabel: 'Delta',
    value: 2,
    color: '#AF0'
  },
  {
    columnLabel: 'Echo',
    multiValues: [{
      value: 1
    },
    {
      value: 1
    },
    {
      value: 1
    },
    {
      value: 1
    }
    ]
  }
  ], {
    title: 'Bar chart with Options',
    titlePosition: 'top',
    gridlineSpacingY: 1,
    dataLabelVerticalAlign: 'center',
    barSpacing: '30px',
    showDataValueLabels: true,
    showDataDescriptions: true,
    dataLabelFontColor: '#DDF',
    dataLabelBgColor: 'rgba(0,0,0,0.3)',
    titleFontColor: '#0AF',
    titleFontSize: '20px'
  },
  'barchart-full');`

eval(basic);
$('#barchart-basic-code').text(basic);

eval(colored);
$('#barchart-colored-code').text(colored);

eval(multi);
$('#barchart-multi-code').text(multi);