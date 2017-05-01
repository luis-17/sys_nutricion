(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('UiTilesController', UiTilesController);

  /** @ngInject */
  function UiTilesController(moment) {
    var vm = this;

    vm.datePicker = {
      date: {
        startDate: moment().subtract(1, "days"),
        endDate: moment()
      }
    };

    vm.opts = {
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
  }

})();
