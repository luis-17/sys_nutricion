(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('PacienteAController', PacienteController)
    // .controller('TablesUiGridController', TablesUiGridController)
    // .controller('BasicUiGridController', BasicUiGridController)
    .controller('FooterUiGridController', FooterUiGridController)
    // .controller('EditUiGridController', EditUiGridController)
    // .filter('mapGender', mapGender)
    // .controller('FilterUiGridController', FilterUiGridController)
    // .controller('ResizeUiGridController', ResizeUiGridController)
    // .controller('ReorderUiGridController', ReorderUiGridController)
    .service('pacienteAServices', pacienteServices);

  /** @ngInject */
  function PacienteAController(pacienteServices) {

    var vm = this;
    vm.selectedItem = {};
    vm.options = {};

    // vm.myData = $resource('http://www.filltext.com/?rows=300&name={firstName}~{lastName}&street={numberLength}&age={numberRange|18,80}&ageMin={numberRange|18,80}&ageMax={numberRange|18,80}&customCellTemplate={numberRange|18,80}&pretty=true').query();

    vm.gridOptions = {
      // showGridFooter: true,
      // showColumnFooter: true,
      // enableFiltering: true,
      columnDefs: [
          { field: 'nombre', width: 150, },
          { field: 'apellidos', width: 150 },

        ],
      // data: vm.myData,
      onRegisterApi: function(gridApi) {
        vm.gridApi = gridApi;
      }
    };
    pacienteServices.sListarPaciente().then(function (rpta) {
      // vm.fDemo = rpta.datos;
      // $log(vm.fDemo,'vm.fDemo');
      console.log('RPTA',rpta);
      // vm.gridOptions.data = rpta.data.datos;
    });

    // vm.remove = function(scope) {
    //   scope.remove();
    // };

    // vm.toggle = function(scope) {
    //   scope.toggle();
    // };

    // vm.expandAll = function() {
    //   vm.$broadcast('angular-ui-tree:expand-all');
    // };

  }
  function pacienteAServices($http, $q) {
    return({
        sListarPaciente: sListarPaciente
    });
    function sListarPaciente(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Paciente/listar_pacientes",
            data : datos
      });
      return (request.then(handleSuccess,handleError));

      // return (request.then(function(response){
      //   return( response.data );

      // }));
    }
  }

})();
