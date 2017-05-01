(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('TablesNgTableController', TablesNgTableController)
    .controller('NgTableSortingController', NgTableSortingController)
    .controller('NgTableEditableController', NgTableEditableController)
    .controller('NgTableGroupingController', NgTableGroupingController)
    .controller('NgTableFilteringController', NgTableFilteringController)
    .controller('NgTableDynamicController', NgTableDynamicController)
    .controller('NgTableRowSelectController', NgTableRowSelectController);

  /** @ngInject */
  function TablesNgTableController() {

  }

  function NgTableSortingController(NgTableParams) {
    var vm = this;
    var data = [{name: 'Moroni', age: 50},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34}];

    vm.tableParams = new NgTableParams({
      // initial sort order
      sorting: { name: "asc" }
    }, {
      dataset: data
    });

  }

  function NgTableEditableController(NgTableParams, _, $scope, $element) {
    var vm = this;
    var data = [{id: 1, name: 'Moroni', age: 50, money: -10},
      {id: 2, name: 'Tiancum', age: 43,money: 120},
      {id: 3, name: 'Jacob', age: 27, money: 5.5},
      {id: 4, name: 'Nephi', age: 29,money: -54},
      {id: 5, name: 'Enos', age: 34,money: 110},
      {id: 6, name: 'Tiancum', age: 43, money: 1000},
      {id: 7, name: 'Jacob', age: 27,money: -201},
      {id: 8, name: 'Nephi', age: 29, money: 100},
      {id: 9, name: 'Enos', age: 34, money: -52.5},
      {id: 10, name: 'Tiancum', age: 43, money: 52.1},
      {id: 11, name: 'Jacob', age: 27, money: 110},
      {id: 12, name: 'Nephi', age: 29, money: -55},
      {id: 13, name: 'Enos', age: 34, money: 551},
      {id: 14, name: 'Tiancum', age: 43, money: -1410},
      {id: 15, name: 'Jacob', age: 27, money: 410},
      {id: 16, name: 'Nephi', age: 29, money: 100},
      {id: 17, name: 'Enos', age: 34, money: -100}
    ];

    vm.checkboxes = {
      checked: false,
      items: {}
    };

    // watch for check all checkbox
    $scope.$watch(function() {
      return vm.checkboxes.checked;
    }, function(value) {
      angular.forEach(data, function(item) {
        vm.checkboxes.items[item.id] = value;
      });
    });

    // watch for data checkboxes
    $scope.$watch(function() {
      return vm.checkboxes.items;
    }, function() {
      var checked = 0, unchecked = 0,
        total = data.length;
      angular.forEach(data, function(item) {
        checked   +=  (vm.checkboxes.items[item.id]) || 0;
        unchecked += (!vm.checkboxes.items[item.id]) || 0;
      });
      if ((unchecked == 0) || (checked == 0)) {
        vm.checkboxes.checked = (checked == total);
      }
      // grayed checkbox
      angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);

    var originalData = angular.copy(data);

    vm.tableParams = new NgTableParams({
      sorting: {
        name: 'asc'
      }
    }, {
      filterDelay: 0,
      dataset: angular.copy(data)
    });

    vm.cancel = cancel;
    vm.del = del;
    vm.save = save;

    //////////

    function cancel(row, rowForm) {
      var originalRow = resetRow(row, rowForm);
      angular.extend(row, originalRow);
    }

    function del(row) {
      _.remove(vm.tableParams.settings().dataset, function(item) {
        return row === item;
      });
      vm.tableParams.reload().then(function(data) {
        if (data.length === 0 && vm.tableParams.total() > 0) {
          vm.tableParams.page(self.tableParams.page() - 1);
          vm.tableParams.reload();
        }
      });
    }

    function resetRow(row, rowForm){
      row.isEditing = false;
      rowForm.$setPristine();
      vm.tableTracker.untrack(row);
      return _.find(originalData, function(r){
        return r.id === row.id;
      });
    }

    function save(row, rowForm) {
      var originalRow = resetRow(row, rowForm);
      angular.extend(originalRow, row);
    }

  }

  function NgTableGroupingController(NgTableParams) {
    var vm = this;
    var data = [{"name":"Karen","age":45,"money":798,"country":"Czech Republic"},{"name":"Cat","age":49,"money":749,"country":"Czech Republic"},{"name":"Bismark","age":48,"money":672,"country":"Denmark"},{"name":"Markus","age":41,"money":695,"country":"Costa Rica"},{"name":"Anthony","age":45,"money":559,"country":"Japan"},{"name":"Alex","age":55,"money":645,"country":"Czech Republic"},{"name":"Stephane","age":57,"money":662,"country":"Japan"},{"name":"Alex","age":59,"money":523,"country":"American Samoa"},{"name":"Tony","age":56,"money":540,"country":"Canada"},{"name":"Cat","age":57,"money":746,"country":"China"},{"name":"Christian","age":59,"money":572,"country":"Canada"},{"name":"Tony","age":60,"money":649,"country":"Japan"},{"name":"Cat","age":47,"money":675,"country":"Denmark"},{"name":"Stephane","age":50,"money":674,"country":"China"},{"name":"Markus","age":40,"money":549,"country":"Portugal"},{"name":"Anthony","age":53,"money":660,"country":"Bahamas"},{"name":"Stephane","age":54,"money":549,"country":"China"},{"name":"Karen","age":50,"money":611,"country":"American Samoa"},{"name":"Therese","age":53,"money":754,"country":"China"},{"name":"Bismark","age":49,"money":791,"country":"Canada"},{"name":"Daraek","age":56,"money":640,"country":"Costa Rica"},{"name":"Tony","age":43,"money":674,"country":"Canada"},{"name":"Karen","age":47,"money":700,"country":"Portugal"},{"name":"Therese","age":47,"money":718,"country":"Czech Republic"},{"name":"Karen","age":50,"money":655,"country":"Japan"},{"name":"Daraek","age":59,"money":581,"country":"American Samoa"},{"name":"Daraek","age":60,"money":595,"country":"Portugal"},{"name":"Markus","age":44,"money":607,"country":"China"},{"name":"Simon","age":58,"money":728,"country":"Japan"},{"name":"Simon","age":49,"money":655,"country":"Bahamas"}];

    vm.tableParams = new NgTableParams({
      // initial grouping
      group: "country"
    }, {
      dataset: data,
      groupOptions: {
        isExpanded: false
      }
    });

    vm.applySelectedGroup = applySelectedGroup;
    vm.isGroupable = isGroupable;
    vm.toggleDetail = toggleDetail;

    //////////

    function applySelectedGroup(){
      vm.tableParams.group(vm.newGroup, vm.isGroupDesc ? 'desc' : 'asc');
      vm.newGroup = "";
      vm.newGroupForm.$setPristine();
    }

    function isGroupable($column){
      return !!$column.groupable();
    }

    function toggleDetail(){
      vm.tableParams.settings().groupOptions.isExpanded = !vm.tableParams.settings().groupOptions.isExpanded;
      return vm.tableParams.reload();
    }
  }

  function NgTableFilteringController(NgTableParams) {
    var vm = this;
    var data = [{"name":"Karen","age":45,"money":798,"country":"Czech Republic"},{"name":"Cat","age":49,"money":749,"country":"Czech Republic"},{"name":"Bismark","age":48,"money":672,"country":"Denmark"},{"name":"Markus","age":41,"money":695,"country":"Costa Rica"},{"name":"Anthony","age":45,"money":559,"country":"Japan"},{"name":"Alex","age":55,"money":645,"country":"Czech Republic"},{"name":"Stephane","age":57,"money":662,"country":"Japan"},{"name":"Alex","age":59,"money":523,"country":"American Samoa"},{"name":"Tony","age":56,"money":540,"country":"Canada"},{"name":"Cat","age":57,"money":746,"country":"China"},{"name":"Christian","age":59,"money":572,"country":"Canada"},{"name":"Tony","age":60,"money":649,"country":"Japan"},{"name":"Cat","age":47,"money":675,"country":"Denmark"},{"name":"Stephane","age":50,"money":674,"country":"China"},{"name":"Markus","age":40,"money":549,"country":"Portugal"},{"name":"Anthony","age":53,"money":660,"country":"Bahamas"},{"name":"Stephane","age":54,"money":549,"country":"China"},{"name":"Karen","age":50,"money":611,"country":"American Samoa"},{"name":"Therese","age":53,"money":754,"country":"China"},{"name":"Bismark","age":49,"money":791,"country":"Canada"},{"name":"Daraek","age":56,"money":640,"country":"Costa Rica"},{"name":"Tony","age":43,"money":674,"country":"Canada"},{"name":"Karen","age":47,"money":700,"country":"Portugal"},{"name":"Therese","age":47,"money":718,"country":"Czech Republic"},{"name":"Karen","age":50,"money":655,"country":"Japan"},{"name":"Daraek","age":59,"money":581,"country":"American Samoa"},{"name":"Daraek","age":60,"money":595,"country":"Portugal"},{"name":"Markus","age":44,"money":607,"country":"China"},{"name":"Simon","age":58,"money":728,"country":"Japan"},{"name":"Simon","age":49,"money":655,"country":"Bahamas"}];

    function getCountries(data) {
      var countries = data.reduce(function(results, item) {
        if (results.indexOf(item.country) < 0) {
          results.push(item.country);
        }
        return results;
      }, []).map(function(country){
        return { id: country, title: country};
      });

      countries.sort(function(a, b) {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      return countries;
    }
    vm.countries = getCountries(data);

    vm.tableParams = new NgTableParams({
      // initial filter
      sorting: {
        name: 'asc'
      },
      filter: { name: "T" }
    }, {
      dataset: data
    });
  }

  function NgTableDynamicController(NgTableParams) {
    var vm = this;
    var data = [{id: 1, name: 'Moroni', age: 50, money: -10},
      {id: 2, name: 'Tiancum', age: 43,money: 120},
      {id: 3, name: 'Jacob', age: 27, money: 5.5},
      {id: 4, name: 'Nephi', age: 29,money: -54},
      {id: 5, name: 'Enos', age: 34,money: 110},
      {id: 6, name: 'Tiancum', age: 43, money: 1000},
      {id: 7, name: 'Jacob', age: 27,money: -201},
      {id: 8, name: 'Nephi', age: 29, money: 100},
      {id: 9, name: 'Enos', age: 34, money: -52.5},
      {id: 10, name: 'Tiancum', age: 43, money: 52.1},
      {id: 11, name: 'Jacob', age: 27, money: 110},
      {id: 12, name: 'Nephi', age: 29, money: -55},
      {id: 13, name: 'Enos', age: 34, money: 551},
      {id: 14, name: 'Tiancum', age: 43, money: -1410},
      {id: 15, name: 'Jacob', age: 27, money: 410},
      {id: 16, name: 'Nephi', age: 29, money: 100},
      {id: 17, name: 'Enos', age: 34, money: -100}];

    vm.cols = [
      { field: "name", title: "Name", show: true },
      { field: "age", title: "Age", show: true },
      { field: "money", title: "Money", show: true }
    ];

    vm.tableParams = new NgTableParams({
      sorting: {
        name: 'asc'
      }
    }, {
      dataset: data
    });

    vm.move = move;

    //////////

    function move(column, currentIdx, value) {
      var newPosition = currentIdx + value;
      if (newPosition >= vm.cols.length || newPosition < 0) {
        return;
      }
      vm.cols[currentIdx] = vm.cols[newPosition];
      vm.cols[newPosition] = column;
    }

  }

  function NgTableRowSelectController(NgTableParams) {
    var vm = this;
    vm.data = [
      {name: 'Moroni', age: 50},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34}
    ];

    vm.tableParams = new NgTableParams({
      // initial filter
      sorting: {
        name: 'asc'
      }
    }, {
      dataset: vm.data
    });
  }

})();
