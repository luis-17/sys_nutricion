(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('TablesUiGridController', TablesUiGridController)
    .controller('BasicUiGridController', BasicUiGridController)
    .controller('FooterUiGridController', FooterUiGridController)
    .controller('EditUiGridController', EditUiGridController)
    .filter('mapGender', mapGender)
    .controller('FilterUiGridController', FilterUiGridController)
    .controller('ResizeUiGridController', ResizeUiGridController)
    .controller('ReorderUiGridController', ReorderUiGridController);

  /** @ngInject */
  function TablesUiGridController() {

  }

  function BasicUiGridController($resource) {
    var vm = this;
    vm.myData = $resource('http://www.filltext.com/?rows=300&firstName={firstName}&lastName={lastName}&company={business}&employed={bool}&pretty=true').query();

    vm.gridOptions = {
      data: vm.myData
    };
  }

  function FooterUiGridController($resource, uiGridConstants){
    var vm = this;
    vm.myData = $resource('http://www.filltext.com/?rows=300&name={firstName}~{lastName}&street={numberLength}&age={numberRange|18,80}&ageMin={numberRange|18,80}&ageMax={numberRange|18,80}&customCellTemplate={numberRange|18,80}&pretty=true').query();

    vm.gridOptions = {
      showGridFooter: true,
      showColumnFooter: true,
      enableFiltering: true,
      columnDefs: [
        { field: 'name', width: 150, aggregationType: uiGridConstants.aggregationTypes.count },
        { field: 'street',aggregationType: uiGridConstants.aggregationTypes.sum, width: 150 },
        { field: 'age', aggregationType: uiGridConstants.aggregationTypes.avg, aggregationHideLabel: true, width: 100 },
        { name: 'ageMin', field: 'age', aggregationType: uiGridConstants.aggregationTypes.min, width: 130, displayName: 'Age for min' },
        { name: 'ageMax', field: 'age', aggregationType: uiGridConstants.aggregationTypes.max, width: 130, displayName: 'Age for max' },
        { name: 'customCellTemplate', field: 'age', width: 150, footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: Red;color: White">custom template</div>' }
      ],
      data: vm.myData,
      onRegisterApi: function(gridApi) {
        vm.gridApi = gridApi;
      }
    };

    vm.toggleFooter = function() {
      vm.gridOptions.showGridFooter = !vm.gridOptions.showGridFooter;
      vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    };

    vm.toggleColumnFooter = function() {
      vm.gridOptions.showColumnFooter = !vm.gridOptions.showColumnFooter;
      vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    };
  }

  function EditUiGridController($resource, $scope) {
    var vm = this;
    vm.myData = $resource('http://www.filltext.com/?rows=300&id={index}&name={firstName}~{lastName}&age={numberRange|18,80}&gender=[1,2]&registered={date}&isActive={bool}&pretty=true').query();

    vm.gridOptions = {
      columnDefs: [
        { name: 'id', enableCellEdit: false, width: '10%' },
        { name: 'name', displayName: 'Name (editable)', width: '20%' },
        { name: 'age', displayName: 'Age' , type: 'number', width: '10%' },
        { name: 'gender', displayName: 'Gender', cellFilter: 'mapGender', width: '20%',editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'gender', editDropdownOptionsArray: [
          { id: 1, gender: 'male' },
          { id: 2, gender: 'female' }
        ] },
        { name: 'registered', displayName: 'Registered' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '20%' },
        { name: 'isActive', displayName: 'Active', type: 'boolean', width: '10%' }
      ],
      data: vm.myData
    };

    vm.msg = {};

    vm.gridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      vm.gridApi = gridApi;
      /* eslint-disable */
      gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue){
        vm.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
        $scope.$apply();
      });
      /* eslint-enable */
    };
  }

  function mapGender() {
    var genderHash = {
      1: 'male',
      2: 'female'
    };

    return function(input) {
      if (!input){
        return '';
      } else {
        return genderHash[input];
      }
    };
  }

  function FilterUiGridController($resource, uiGridConstants) {
    var vm = this;
    vm.myData = $resource('http://www.filltext.com/?rows=300&name={firstName}~{lastName}&gender=["male","female"]&company={business}&email={email}&phone={phone}&age={numberRange|18,80}}&pretty=true').query();

    vm.gridOptions = {
      data: vm.myData,
      enableFiltering: true,
      columnDefs: [
        // default
        { field: 'name' },
        // pre-populated search field
        { field: 'gender', filter: { term: 'female' } },
        // no filter input
        { field: 'company', enableFiltering: false  },
        // specifies one of the built-in conditions
        // and a placeholder for the input
        {
          field: 'email',
          filter: {
            condition: uiGridConstants.filter.ENDS_WITH,
            placeholder: 'ends with'
          }
        },
        // custom condition function
        {
          field: 'phone',
          filter: {
            condition: function(searchTerm, cellValue) {
              var strippedValue = (cellValue + '').replace(/[^\d]/g, '');
              return strippedValue.indexOf(searchTerm) >= 0;
            }
          }
        },
        // multiple filters
        { field: 'age', filters: [
          {
            condition: uiGridConstants.filter.GREATER_THAN,
            placeholder: 'greater than'
          },
          {
            condition: uiGridConstants.filter.LESS_THAN,
            placeholder: 'less than'
          }
        ]}
      ]
    };
  }

  function ResizeUiGridController($resource){
    var vm = this;
    vm.myData = $resource('http://www.filltext.com/?rows=300&name={firstName}~{lastName}&gender=["male","female"]&company={business}&pretty=true').query();

    vm.gridOptions = {
      enableSorting: true,
      columnDefs: [
        { field: 'name', minWidth: 200, width: '50%' },
        { field: 'gender', width: '30%', enableColumnResizing: false },
        { field: 'company', width: '20%' }
      ],
      data: vm.myData
    };
  }

  function ReorderUiGridController($resource) {
    var vm = this;
    vm.myData = $resource('http://www.filltext.com/?rows=300&name={firstName}~{lastName}&gender=["male","female"]&company={business}&pretty=true').query();

    vm.gridOptions = {
      data: vm.myData
    };
  }

})();
