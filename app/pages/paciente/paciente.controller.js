angular.module('minotaur')
  .controller('PacienteController', ['$scope', '$sce', '$filter',  '$window', '$http', '$log', '$timeout', 'PacienteServices',
    function($scope, $sce, $filter,  $window, $http, $log, $timeout,
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

      vm.mySelectionGrid = [];
      vm.gridOptions = {
        // showGridFooter: true,
        // showColumnFooter: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableFullRowSelection: true,
        enableFiltering: true,
        multiSelect: false,
      }
      vm.gridOptions.columnDefs = [
        { field: 'nombre', name:'nombre', displayName: 'NOMBRE', width: 150, },
        { field: 'apellidos', name:'apellidos', displayName: 'APELLIDOS' },
        { field: 'accion', name:'accion', displayName: 'ACCION', width: 80, enableFiltering: false, },

      ];
        // data: vm.myData,
      vm.gridOptions.onRegisterApi = function(gridApi) {
        vm.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          vm.mySelectionGrid = gridApi.selection.getSelectedRows();
        });
        gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
          vm.mySelectionGrid = gridApi.selection.getSelectedRows();
        });
      }


      vm.getPaginationServerSide = function() {
        PacienteServices.sListarPaciente().then(function (rpta) {
          // vm.fDemo = rpta.datos;
          // $log(vm.fDemo,'vm.fDemo');
          console.log('RPTA',rpta.datos);
          vm.gridOptions.data = rpta.datos;
          vm.mySelectionGrid = [];
        });
      }
      vm.getPaginationServerSide();

      vm.btnNuevo = function () {
        console.log('btn nuevo');
      }

      // vm.remove = function(scope) {
      //   scope.remove();
      // };

      // vm.toggle = function(scope) {
      //   scope.toggle();
      // };

      // vm.expandAll = function() {
      //   vm.$broadcast('angular-ui-tree:expand-all');
      // };

  }])
  .service("PacienteServices",function($http, $q) {
    return({
        sListarPaciente: sListarPaciente,
        sRegistrar: sRegistrar,

    });

    function sListarPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/listar_pacientes",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
      // return (request.then(function(response){
      //   return( response.data );

      // }));
    }
    function sRegistrar(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/registrar",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }

  });
