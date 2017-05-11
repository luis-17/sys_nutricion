angular.module('minotaur')
  .controller('PacienteController', ['$scope', '$sce', '$filter',  '$window', '$http', '$log', '$timeout', 'uiGridConstants', '$resource',
    'PacienteServices',
    function($scope, $sce, $filter,  $window, $http, $log, $timeout, uiGridConstants, $resource,
      PacienteServices,

    ) {
    // 'use strict';
      var vm = this;
      vm.selectedItem = {};
      vm.options = {};

      // vm.myData = $resource('http://www.filltext.com/?rows=300&name={firstName}~{lastName}&street={numberLength}&age={numberRange|18,80}&ageMin={numberRange|18,80}&ageMax={numberRange|18,80}&customCellTemplate={numberRange|18,80}&pretty=true').query();
      // vm.myData = [{
      //   'nombre' : 'JOHN',
      //   'apellido' : 'DENVER',
      // }];


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
      vm.fDemo = {};
      // $log('asd');
      PacienteServices.sListarPaciente().then(function (rpta) {
        // vm.fDemo = rpta.datos;
        // $log(vm.fDemo,'vm.fDemo');
        console.log('RPTA',rpta.data.datos);
        vm.gridOptions.data = rpta.data.datos;
      });


      vm.remove = function(scope) {
        scope.remove();
      };

      vm.toggle = function(scope) {
        scope.toggle();
      };

      vm.expandAll = function() {
        vm.$broadcast('angular-ui-tree:expand-all');
      };

  }])
  .service("PacienteServices",function($http, $q) {
    return({
        sListarPaciente: sListarPaciente,

    });

    function sListarPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/listar_pacientes",
            data : datos
      });
      // return (request.then(handleSuccess,handleError));
      return request;
    }

  });