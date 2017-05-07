(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('DashboardController', DashboardController)
    .controller('StatisticsController', StatisticsController)
    .controller('RealtimeLoadController', RealtimeLoadController)
    .controller('ProjectsController', ProjectsController);

  /** @ngInject */
  function DashboardController(moment) {
    var vm = this;

    vm.datePicker = {
      date: {
        startDate: moment().subtract(1, "days"),
        endDate: moment()
      },
      opts: {
        ranges: {
          'This Month': [moment().startOf('month'), moment()],
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left'
      }
    };
  }

  function StatisticsController() {
    var vm = this;

    vm.colors = ['#e05d6f', '#23a9e6'];

    vm.options = {
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 15
        },
        usePointStyle: false
      },
      tooltips: {
        titleSpacing: 10,
        titleMarginBottom: 10,
        bodySpacing: 8,
        cornerRadius: 3,
        xPadding: 15,
        yPadding: 15
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontFamily: '"Raleway", "Arial", sans-serif',
            fontSize: 13,
            fontStyle: 'bold',
            fontColor: '#878787'
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontFamily: '"Raleway", "Arial", sans-serif',
            fontSize: 13,
            fontStyle: 'bold',
            fontColor: '#878787'
          }
        }]
      }
    };

    vm.labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    vm.data = [
      [14, 40, 35, 39, 42, 50, 46, 49, 59, 60, 58, 74],
      [50, 80, 90, 85, 99, 125, 114, 96, 130, 145, 139, 160]
    ];
    vm.datasetOverride = [{
      label: "Unique Visits",
      borderColor: '#e05d6f',
      backgroundColor: 'rgba(224,93,111,0.2)',
      borderWidth: 3,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      type: 'line',
      pointHoverBorderColor: "#e05d6f",
      pointHoverBackgroundColor: "#e05d6f"
    }, {
      label: "Page Views",
      backgroundColor: '#23a9e6',
      hoverBackgroundColor: '#057cb2',
      borderWidth: 0,
      type: 'bar'
    }];
  }

  function RealtimeLoadController($scope, $interval) {
    /* eslint-disable */
    $scope.options = {
      renderer: 'area',
      height: 133
    };

    $scope.seriesData = [[], []];
    var random = new Rickshaw.Fixtures.RandomData(50);

    for (var i = 0; i < 50; i++) {
      random.addData($scope.seriesData);
    }

    var updateInterval = 800;

    $interval(function() {
      random.removeData($scope.seriesData);
      random.addData($scope.seriesData);
      for (var i = 0; i < $scope.series.length; i++) {
        var name = $scope.series[i].name;
        var color = $scope.series[i].color;
        var data = $scope.seriesData[i];
        $scope.series[i] = {
          name: name,
          color: color,
          data: data
        };
      }
    }, updateInterval);

    $scope.series = [{
      name: 'Series 1',
      color: 'steelblue',
      data: $scope.seriesData[0]
    }, {
      name: 'Series 2',
      color: 'lightblue',
      data: $scope.seriesData[1]
    }];

    $scope.features = {
      hover: {
        xFormatter: function(x) {
          return new Date(x * 1000).toUTCString();
        },
        yFormatter: function(y) {
          return Math.floor(y) + '%';
        }
      }
    };
    /* eslint-enable */

  }

  function ProjectsController(DTOptionsBuilder, DTColumnDefBuilder) {
    var vm = this;

    vm.projects = [{
      title: 'Graphic layout for client',
      priority: {
        value: 1,
        title: 'High Priority'
      },
      status: 42,
      chart: {
        data: [1,3,2,3,5,6,8,5,9,8],
        color: '#cd97eb'
      }
    },{
      title: 'Make website responsive',
      priority: {
        value: 3,
        title: 'Low Priority'
      },
      status: 89,
      chart: {
        data: [2,5,3,4,6,5,1,8,9,10],
        color: '#a2d200'
      }
    },{
      title: 'Clean html/css/js code',
      priority: {
        value: 1,
        title: 'High Priority'
      },
      status: 23,
      chart: {
        data: [5,6,8,2,1,6,8,4,3,5],
        color: '#ffc100'
      }
    },{
      title: 'Database optimization',
      priority: {
        value: 2,
        title: 'Normal Priority'
      },
      status: 56,
      chart: {
        data: [2,9,8,7,5,9,2,3,4,2],
        color: '#16a085'
      }
    },{
      title: 'Database migration',
      priority: {
        value: 3,
        title: 'Low Priority'
      },
      status: 48,
      chart: {
        data: [3,5,6,2,8,9,5,4,3,2],
        color: '#1693A5'
      }
    },{
      title: 'Email server backup',
      priority: {
        value: 2,
        title: 'Normal Priority'
      },
      status: 10,
      chart: {
        data: [7,8,6,4,3,5,8,9,10,7],
        color: '#3f4e62'
      }
    },{
      title: 'Fix datatables template',
      priority: {
        value: 1,
        title: 'High Priority'
      },
      status: 35,
      chart: {
        data: [7,5,0,7,8,9,18,6,4,3],
        color: '#fcc101'
      }
    },{
      title: 'Get the license info',
      priority: {
        value: 3,
        title: 'Low Priority'
      },
      status: 80,
      chart: {
        data: [4,3,5,8,9,5,6,4,3],
        color: '#5cb85c'
      }
    }];

    vm.dtOptions = DTOptionsBuilder.newOptions()
        // Add Bootstrap compatibility
        .withBootstrap();

    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2),
      DTColumnDefBuilder.newColumnDef(3),
      DTColumnDefBuilder.newColumnDef(4).notSortable()
    ];
  }

})();
