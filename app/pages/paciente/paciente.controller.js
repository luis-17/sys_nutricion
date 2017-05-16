(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('PacienteController', PacienteController)
    .service('PacienteServices', PacienteServices);

  /** @ngInject */
  function PacienteController($scope,PacienteServices,$uibModal) {

    var vm = this;
    vm.selectedItem = {};
    vm.options = {};
    // vm.fDemo = {};
    // PacienteServices.sListarPaciente().then(function (rpta) {
    //   vm.fDemo = rpta.datos;
    //   console.log(vm.fDemo,'vm.fDemo');
    // });
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
        vm.activeStep = 0;
        vm.user = {};
        vm.titleForm = 'Regitro de Pacientes';
        // vm.items = ['item1', 'item2', 'item3'];
        var modalInstance = $uibModal.open({
          templateUrl: angular.patchURLCI+'Paciente/ver_popup_formulario',
          controller: 'ModalInstanceController',
          controllerAs: 'modal',
          size: 'lg',
          backdropClass: 'splash splash-2 splash-ef-14',
          windowClass: 'splash splash-2 splash-ef-14',
          // animation: true,
          resolve: {
            items: function () {
              return vm.user;
            },
            getPaginationServerSide: function() {
              return vm.getPaginationServerSide;
            }
          }
        });
        // modalInstance.result.then(function (selectedItem) {
        //   vm.selected = selectedItem;
        // }, function () {
        //   $log.info('Modal dismissed at: ' + new Date());
        // });
        function ModalInstanceController($uibModalInstance,items) {
          var vm = this;
          vm.getPaginationServerSide = getPaginationServerSide;

          // vm.items = items;
          // vm.selected = {
          //   item: vm.items[0]
          // };
          console.log(vm.user);
          vm.ok = function () {
            // $uibModalInstance.close(vm.selected.item);

          };

          vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        }
      }

  }
  function PacienteServices($http, $q) {
    return({
        sListarPaciente: sListarPaciente,
        sRegistrar: sRegistrar,
    });
    function sListarPaciente(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Paciente/listar_pacientes",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
    function sRegistrar(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/registrar",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
})();