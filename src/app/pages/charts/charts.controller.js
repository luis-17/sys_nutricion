(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('ChartsController', ChartsController)
    .controller('MorrisChartsController', MorrisChartsController)
    .controller('SparklineChartsController', SparklineChartsController)
    .controller('EasyPieChartsController', EasyPieChartsController)
    .controller('GaugejsChartsController', GaugejsChartsController)
    .controller('FlotLineChartController', FlotLineChartController)
    .controller('FlotBarChartController', FlotBarChartController)
    .controller('FlotStackedBarChartController', FlotStackedBarChartController)
    .controller('FlotCombinedChartController', FlotCombinedChartController)
    .controller('FlotPieChartController', FlotPieChartController)
    .controller('FlotDonutChartController', FlotDonutChartController)
    .controller('FlotRealtimeChartController', FlotRealtimeChartController)
    .controller('RickshawChartController', RickshawChartController);

  /** @ngInject */
  function ChartsController() {

  }

  function MorrisChartsController() {
    var vm = this;

    vm.basicData = [
      { year: '2009', a: 15,  b: 5 },
      { year: '2010', a: 20,  b: 10 },
      { year: '2011', a: 35,  b: 25 },
      { year: '2012', a: 40, b: 30 }
    ];

    vm.donutData = [
      {label: 'Download Sales', value: 12},
      {label: 'In-Store Sales', value: 30},
      {label: 'Mail-Order Sales', value: 20}
    ];

    vm.areaData = [
      { year: '2009', a: 10,  b: 3 },
      { year: '2010', a: 14,  b: 5 },
      { year: '2011', a: 8,  b: 2 },
      { year: '2012', a: 20, b: 15 }
    ];
  }

  function SparklineChartsController() {
    var vm = this;

    vm.lineChart = {
      data: [15,16,18,17,16,18,25,26,23],
      options: {
        type: 'line',
        width: '100%',
        height:'250px',
        fillColor: 'rgba(34, 190, 239, .3)',
        lineColor: 'rgba(34, 190, 239, .5)',
        lineWidth: 2,
        spotRadius: 5,
        valueSpots:[5,6,8,7,6,8,5,4,7],
        minSpotColor: '#eaf9fe',
        maxSpotColor: '#00a3d8',
        highlightSpotColor: '#00a3d8',
        highlightLineColor: '#bec6ca',
        normalRangeMin: 0
      }
    };
    vm.barChart = {
      data: [5,6,7,2,1,-4,-2,4,6,8],
      options: {
        width:'100%',
        type: 'bar',
        height: '250px',
        barWidth: '30px',
        barSpacing: 10,
        barColor: '#16a085',
        negBarColor: '#FF0066'
      }
    };
    vm.pieChart = {
      data: [5,10,20,15],
      options: {
        type: 'pie',
        width: 'auto',
        height: '250px',
        sliceColors: ['#22beef','#a2d200','#ffc100','#ff4a43']
      }
    };
  }

  function EasyPieChartsController() {
    var vm = this;

    vm.easypiechart = {
      percent: 65,
      options: {
        animate: {
          duration: 3000,
          enabled: true
        },
        barColor: '#1693A5',
        lineCap: 'round',
        size: 180,
        lineWidth: 5
      }
    };
    vm.easypiechart2 = {
      percent: 30,
      options: {
        animate: {
          duration: 3000,
          enabled: true
        },
        barColor: '#A40778',
        scaleColor: false,
        lineCap: 'round',
        size: 180,
        lineWidth: 5
      }
    };
    vm.easypiechart3 = {
      percent: 78,
      options: {
        animate: {
          duration: 3000,
          enabled: true
        },
        barColor: '#e05d6f',
        lineCap: 'butt',
        size: 220,
        lineWidth: 10
      }
    };
    vm.easypiechart4 = {
      percent: 60,
      options: {
        animate: {
          duration: 3000,
          enabled: true
        },
        barColor: '#5cb85c',
        lineCap: 'round',
        scaleColor: false,
        size: 220,
        lineWidth: 10
      }
    };
  }

  function GaugejsChartsController() {
    var vm = this;

    vm.gaugeChart1 = {
      data: {
        maxValue: 3000,
        animationSpeed: 40,
        val: 658
      },
      options: {
        lines: 12,
        // The number of lines to draw
        angle: 0.15,
        // The length of each line
        lineWidth: 0.44,
        // The line thickness
        pointer: {
          length: 1,
          // The radius of the inner circle
          strokeWidth: 0.035,
          // The rotation offset
          color: '#000000' // Fill color
        },
        limitMax: 'false',
        // If true, the pointer will not go past the end of the gauge
        colorStart: '#6FADCF',
        // Colors
        colorStop: '#8FC0DA',
        // just experiment with them
        strokeColor: '#f2f2f2',
        // to see which ones work best for you
        generateGradient: true,
        percentColors: [
          [0.0, '#1693A5'],
          [1.0, '#1693A5']
        ]
      }
    };

    vm.gaugeChart2 = {
      data: {
        maxValue: 3000,
        animationSpeed: 40,
        val: 1258
      },
      options: {
        lines: 12,
        // The number of lines to draw
        angle: 0.10,
        // The length of each line
        lineWidth: 0.40,
        // The line thickness
        pointer: {
          length: 0.9,
          // The radius of the inner circle
          strokeWidth: 0.035,
          // The rotation offset
          color: '#000000' // Fill color
        },
        limitMax: 'false',
        // If true, the pointer will not go past the end of the gauge
        colorStart: '#6FADCF',
        // Colors
        colorStop: '#8FC0DA',
        // just experiment with them
        strokeColor: '#f2f2f2',
        // to see which ones work best for you
        generateGradient: true,
        percentColors: [
          [0.0, '#FF0066'],
          [1.0, '#FF0066']
        ]
      }
    };

    vm.gaugeChart3 = {
      data: {
        maxValue: 3000,
        animationSpeed: 40,
        val: 1485
      },
      options: {
        lines: 12,
        // The number of lines to draw
        angle: 0.05,
        // The length of each line
        lineWidth: 0.34,
        // The line thickness
        pointer: {
          length: 0.8,
          // The radius of the inner circle
          strokeWidth: 0.035,
          // The rotation offset
          color: '#000000' // Fill color
        },
        limitMax: 'false',
        // If true, the pointer will not go past the end of the gauge
        colorStart: '#6FADCF',
        // Colors
        colorStop: '#8FC0DA',
        // just experiment with them
        strokeColor: '#f2f2f2',
        // to see which ones work best for you
        generateGradient: true,
        percentColors: [
          [0.0, '#428bca'],
          [1.0, '#428bca']
        ]
      }
    };

    vm.gaugeChart4 = {
      data: {
        maxValue: 3000,
        animationSpeed: 40,
        val: 2514
      },
      options: {
        lines: 12,
        // The number of lines to draw
        angle: 0,
        // The length of each line
        lineWidth: 0.3,
        // The line thickness
        pointer: {
          length: 0.7,
          // The radius of the inner circle
          strokeWidth: 0.035,
          // The rotation offset
          color: '#000000' // Fill color
        },
        limitMax: 'false',
        // If true, the pointer will not go past the end of the gauge
        colorStart: '#6FADCF',
        // Colors
        colorStop: '#8FC0DA',
        // just experiment with them
        strokeColor: '#f2f2f2',
        // to see which ones work best for you
        generateGradient: true,
        percentColors: [
          [0.0, '#f0ad4e'],
          [1.0, '#f0ad4e']
        ]
      }
    };
  }

  function FlotLineChartController() {
    var vm = this;

    vm.dataset = [{
      data: [[1,5.3],[2,5.9],[3,7.2],[4,8],[5,7],[6,6.5],[7,6.2],[8,6.7],[9,7.2],[10,7],[11,6.8],[12,7]],
      label: 'Sales',
      points: {
        show: true,
        radius: 6
      },
      splines: {
        show: true,
        tension: 0.45,
        lineWidth: 5,
        fill: 0
      }
    }, {
      data: [[1,6.6],[2,7.4],[3,8.6],[4,9.4],[5,8.3],[6,7.9],[7,7.2],[8,7.7],[9,8.9],[10,8.4],[11,8],[12,8.3]],
      label: 'Orders',
      points: {
        show: true,
        radius: 6
      },
      splines: {
        show: true,
        tension: 0.45,
        lineWidth: 5,
        fill: 0
      }
    }];

    vm.options = {
      colors: ['#a2d200', '#cd97eb'],
      series: {
        shadowSize: 0
      },
      xaxis:{
        font: {
          color: '#ccc'
        },
        position: 'bottom',
        ticks: [
          [ 1, 'Jan' ], [ 2, 'Feb' ], [ 3, 'Mar' ], [ 4, 'Apr' ], [ 5, 'May' ], [ 6, 'Jun' ], [ 7, 'Jul' ], [ 8, 'Aug' ], [ 9, 'Sep' ], [ 10, 'Oct' ], [ 11, 'Nov' ], [ 12, 'Dec' ]
        ]
      },
      yaxis: {
        font: {
          color: '#ccc'
        }
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true,
      tooltipOpts: {
        content: '%s: %y.4',
        defaultTheme: false,
        shifts: {
          x: 0,
          y: 20
        }
      }
    };
  }

  function FlotBarChartController() {
    var vm = this;

    vm.data2 = [];

    for (var i = 0; i < 20; ++i) {
      vm.data2.push([i, Math.sin(i+0.1)]);
    }

    vm.dataset = [{
      data: vm.data2,
      label: 'Satisfaction',
      color: '#e05d6f'
    }];

    vm.options = {
      series: {
        shadowSize: 0
      },
      bars: {
        show: true,
        barWidth: 0.6,
        lineWidth: 0,
        fillColor: {
          colors: [{ opacity:0.8 }, { opacity:0.8}]
        }
      },
      xaxis: {
        font: {
          color: '#ccc'
        }
      },
      yaxis: {
        font: {
          color: '#ccc'
        },
        min: -2,
        max: 2
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true
    };
  }

  function FlotStackedBarChartController() {
    var vm = this;

    vm.dataset = [{
      data: [[10, 50], [20, 80], [30, 60], [40, 40]],
      label: 'A'
    }, {
      data: [[10, 30], [20, 50], [30, 70], [40, 50]],
      label: 'B'
    }, {
      data: [[10, 40], [20, 60], [30, 90], [40, 60]],
      label: 'C'
    }];

    vm.options = {
      series: {
        shadowSize: 0,
        stack: true // stack bars
      },
      bars: {
        show: true,
        fill: true,
        lineWidth: 0,
        fillColor: {
          colors: [{ opacity:0.6 }, { opacity:0.8}]
        },
        colors: ['#428bca','#d9534f','#A40778']
      },
      xaxis: {
        font: {
          color: '#ccc'
        }
      },
      yaxis: {
        font: {
          color: '#ccc'
        }
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true
    };
  }

  function FlotCombinedChartController() {
    var vm = this;

    vm.dataset = [{
      data: [[0, 8], [1, 15], [2, 16], [3, 14], [4,16], [5,18], [6,17], [7,15], [8,12], [9,13]],
      label: 'Unique Visits',
      points: {
        show: true,
        radius: 3
      },
      splines: {
        show: true,
        tension: 0.45,
        lineWidth: 4,
        fill: 0
      }
    }, {
      data: [[0, 5], [1, 9], [2, 10], [3, 8], [4,9], [5, 12], [6, 14], [7, 13], [8, 10], [9, 12]],
      label: 'Page Views',
      bars: {
        show: true,
        barWidth: 0.4,
        lineWidth: 0,
        fillColor: { colors: [{ opacity: 0.6 }, { opacity: 0.8}] }
      }
    }];

    vm.options = {
      colors: ['#16a085','#FF0066'],
      series: {
        shadowSize: 0
      },
      xaxis: {
        font: {
          color: '#ccc'
        }
      },
      yaxis: {
        font: {
          color: '#ccc'
        }
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true,
      tooltipOpts: { content: '%s of %x.1 is %y.4',  defaultTheme: false, shifts: { x: 0, y: 20 } }
    };
  }

  function FlotPieChartController() {
    var vm = this;

    vm.dataset = [
      { label: 'Chrome', data: 30 },
      { label: 'Firefox', data: 15 },
      { label: 'Safari', data: 15 },
      { label: 'IE', data: 10 },
      { label: 'Opera', data: 5 },
      { label: 'Other', data: 10}
    ];

    vm.options = {
      series: {
        pie: {
          show: true,
          innerRadius: 0,
          stroke: {
            width: 0
          },
          label: {
            show: true,
            threshold: 0.05
          }
        }
      },
      colors: ['#428bca','#5cb85c','#f0ad4e','#d9534f','#5bc0de','#616f77'],
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true,
      tooltipOpts: { content: '%s: %p.0%' }
    };
  }

  function FlotDonutChartController() {
    var vm = this;

    vm.dataset = [
      { label: 'Chrome', data: 30 },
      { label: 'Firefox', data: 15 },
      { label: 'Safari', data: 15 },
      { label: 'IE', data: 10 },
      { label: 'Opera', data: 5 },
      { label: 'Other', data: 10}
    ];

    vm.options = {
      series: {
        pie: {
          show: true,
          innerRadius: 0.5,
          stroke: {
            width: 0
          },
          label: {
            show: true,
            threshold: 0.05
          }
        }
      },
      colors: ['#428bca','#5cb85c','#f0ad4e','#d9534f','#5bc0de','#616f77'],
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true,
      tooltipOpts: { content: '%s: %p.0%' }
    };
  }

  function FlotRealtimeChartController($interval) {
    var vm = this;

    var data = [],
      totalPoints = 300;

    function getRandomData() {

      if (data.length > 0) {
        data = data.slice(1);
      }

      // Do a random walk

      while (data.length < totalPoints) {

        var prev = data.length > 0 ? data[data.length - 1] : 50,
          y = prev + Math.random() * 10 - 5;

        if (y < 0) {
          y = 0;
        } else if (y > 100) {
          y = 100;
        }

        data.push(y);
      }

      // Zip the generated y values with the x values

      var res = [];
      for (var i = 0; i < data.length; ++i) {
        res.push([i, data[i]]);
      }

      return res;
    }

    var updateInterval = 300;

    $interval(function() {
      vm.dataset = [{
        data: getRandomData()
      }];
      getRandomData();
    }, updateInterval);

    vm.dataset = [{
      data: getRandomData()
    }];

    vm.options = {
      colors: ['#a2d200'],
      series: {
        shadowSize: 0,
        lines: {
          show: true,
          fill: 0.1
        }
      },
      xaxis:{
        font: {
          color: '#ccc'
        },
        tickFormatter: function() {
          return '';
        }
      },
      yaxis: {
        font: {
          color: '#ccc'
        },
        min: 0,
        max: 110
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        color: '#ccc'
      },
      tooltip: true,
      tooltipOpts: {
        content: '%y%',
        defaultTheme: false,
        shifts: {
          x: 0,
          y: 20
        }
      }
    };
  }

  function RickshawChartController() {
    var vm = this;

    vm.renderers = [{
      id: 'area',
      name: 'Area'
    }, {
      id: 'line',
      name: 'Line'
    }, {
      id: 'bar',
      name: 'Bar'
    }, {
      id: 'scatterplot',
      name: 'Scatterplot'
    }];

    vm.palettes = [
      'spectrum14',
      'spectrum2000',
      'spectrum2001',
      'colorwheel',
      'cool',
      'classic9',
      'munin'
    ];

    vm.rendererChanged = function(id) {
      vm['options' + id] = {
        renderer: vm['renderer' + id].id
      };
    };

    vm.paletteChanged = function(id) {
      vm['features' + id] = {
        palette: vm['palette' + id]
      };
    };

    vm.changeSeriesData = function(id) {
      var seriesList = [];
      for (var i = 0; i < 3; i++) {
        var series = {
          name: 'Series ' + (i + 1),
          data: []
        };
        for (var j = 0; j < 10; j++) {
          series.data.push({x: j, y: Math.random() * 20});
        }
        seriesList.push(series);
        vm['series' + id][i] = series;
      }
      //$scope['series' + id] = seriesList;
    };

    vm.options1 = {
      renderer: 'area'
    };
    vm.series1 = [{
      name: 'Series 1',
      color: 'steelblue',
      data: [{x: 0, y: 23}, {x: 1, y: 15}, {x: 2, y: 79}, {x: 3, y: 31}, {x: 4, y: 60}]
    }, {
      name: 'Series 2',
      color: 'lightblue',
      data: [{x: 0, y: 30}, {x: 1, y: 20}, {x: 2, y: 64}, {x: 3, y: 50}, {x: 4, y: 15}]
    }];

    vm.options2 = {
      renderer: 'line'
    };
    vm.features2 = {
      hover: {
        xFormatter: function(x) {
          return 't=' + x;
        },
        yFormatter: function(y) {
          return '$' + y;
        }
      }
    };
    vm.series2 = [{
      name: 'Series 1',
      color: 'steelblue',
      data: [{x: 0, y: 23}, {x: 1, y: 15}, {x: 2, y: 79}, {x: 3, y: 31}, {x: 4, y: 60}]
    }, {
      name: 'Series 2',
      color: 'lightblue',
      data: [{x: 0, y: 30}, {x: 1, y: 20}, {x: 2, y: 64}, {x: 3, y: 50}, {x: 4, y: 15}]
    }];

    vm.options3 = {
      renderer: 'bar'
    };
    vm.features3 = {
      palette: 'colorwheel'
    };
    vm.series3 = [{
      name: 'Series 1',
      data: [{x: 0, y: 23}, {x: 1, y: 15}, {x: 2, y: 79}, {x: 3, y: 31}, {x: 4, y: 60}]
    }, {
      name: 'Series 2',
      data: [{x: 0, y: 30}, {x: 1, y: 20}, {x: 2, y: 64}, {x: 3, y: 50}, {x: 4, y: 15}]
    }];

    vm.options4 = {
      renderer: 'bar'
    };
    vm.features4 = {
      palette: 'colorwheel',
      xAxis: {
      }
    };
    vm.series4 = [{
      name: 'Series 1',
      data: [{x: 0, y: 230}, {x: 1, y: 1500}, {x: 2, y: 790}, {x: 3, y: 310}, {x: 4, y: 600}]
    }, {
      name: 'Series 2',
      data: [{x: 0, y: 300}, {x: 1, y: 2000}, {x: 2, y: 640}, {x: 3, y: 500}, {x: 4, y: 150}]
    }];

    vm.options5 = {
      renderer: 'bar'
    };
    vm.features5 = {
      palette: 'colorwheel',
      yAxis: {
        tickFormat: 'formatKMBT'
      }
    };
    vm.series5 = [{
      name: 'Series 1',
      data: [{x: 0, y: 230}, {x: 1, y: 1500}, {x: 2, y: 790}, {x: 3, y: 310}, {x: 4, y: 600}]
    }, {
      name: 'Series 2',
      data: [{x: 0, y: 300}, {x: 1, y: 2000}, {x: 2, y: 640}, {x: 3, y: 500}, {x: 4, y: 150}]
    }];

    vm.options6 = {
      renderer: 'line'
    };
    vm.features6 = {
      palette: 'colorwheel',
      legend: {
        toggle: true,
        highlight: true
      }
    };
    vm.series6 = [{
      name: 'Series 1',
      data: [{x: 0, y: 230}, {x: 1, y: 1500}, {x: 2, y: 790}, {x: 3, y: 310}, {x: 4, y: 600}]
    }, {
      name: 'Series 2',
      data: [{x: 0, y: 300}, {x: 1, y: 2000}, {x: 2, y: 640}, {x: 3, y: 500}, {x: 4, y: 150}]
    }];

    vm.series0 = [];

    vm.renderer0 = vm.renderers[0];
    vm.palette0 = vm.palettes[0];

    vm.rendererChanged(0);
    vm.paletteChanged(0);
    vm.changeSeriesData(0);
  }

})();
