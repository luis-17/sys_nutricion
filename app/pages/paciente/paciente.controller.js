(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('PacienteController', PacienteController)
    .controller('TablesUiGridController', TablesUiGridController)
    .controller('BasicUiGridController', BasicUiGridController)
    .controller('FooterUiGridController', FooterUiGridController)
    .controller('EditUiGridController', EditUiGridController)
    .filter('mapGender', mapGender)
    .controller('FilterUiGridController', FilterUiGridController)
    .controller('ResizeUiGridController', ResizeUiGridController)
    .controller('ReorderUiGridController', ReorderUiGridController)
    .service('PacienteServices', PacienteServices);

  /** @ngInject */
  function PacienteController($resource, uiGridConstants) {

    var vm = this;
    vm.selectedItem = {};
    vm.options = {};

    vm.myData = $resource('http://www.filltext.com/?rows=300&name={firstName}~{lastName}&street={numberLength}&age={numberRange|18,80}&ageMin={numberRange|18,80}&ageMax={numberRange|18,80}&customCellTemplate={numberRange|18,80}&pretty=true').query();

    vm.gridOptions = {
      // showGridFooter: true,
      // showColumnFooter: true,
      // enableFiltering: true,
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
    vm.fDemo = {};
    // $log('asd');
    console.log('asd')
    // PacienteServices.sListarDemo().then(function (rpta) {
    //   vm.fDemo = rpta.datos;
    //   // $log(vm.fDemo,'vm.fDemo');
    //   console.log(vm.fDemo,'vm.fDemo');
    // });

    vm.remove = function(scope) {
      scope.remove();
    };

    vm.toggle = function(scope) {
      scope.toggle();
    };

    vm.expandAll = function() {
      vm.$broadcast('angular-ui-tree:expand-all');
    };

  }
  function PacienteServices($http, $q) {
    return({
        sListarDemo: sListarDemo
    });
    function sListarDemo(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Paciente/obtener_fila_demo",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
  }
})();
