(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('PacienteController', PacienteController)
    .service('PacienteServices', PacienteServices);

  /** @ngInject */
  function PacienteController($scope,$uibModal,PacienteServices,TipoClienteServices,EmpresaServices) {

    var vm = this;

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
        vm.gridOptions.data = rpta.datos;
        vm.mySelectionGrid = [];
      });
    }
    vm.getPaginationServerSide();
    // MANTENIMIENTO
    vm.btnNuevo = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/pages/paciente/paciente_formview.html',
        controllerAs: 'modalPac',
        size: 'lg',
        backdropClass: 'splash splash-2 splash-ef-14',
        windowClass: 'splash splash-2 splash-ef-14',
        // controller: 'ModalInstanceController',
        controller: function($scope, $uibModalInstance, arrToModal ){
          var vm = this;
          vm.fData = {};
          vm.getPaginationServerSide = arrToModal.getPaginationServerSide;
          vm.modalTitle = 'Registro de pacientes';
          vm.activeStep = 0;
          vm.listaSexos = [
            { id:'', descripcion:'--Seleccione sexo--' },
            { id:'M', descripcion:'MASCULINO' },
            { id:'F', descripcion:'FEMENINO' }
          ];
          vm.fData.sexo = vm.listaSexos[0].id;
          // TIPO DE CLIENTE
          TipoClienteServices.sListarTipoClienteCbo().then(function (rpta) {
            vm.listaTiposClientes = angular.copy(rpta.datos);
            vm.listaTiposClientes.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
            if(vm.fData.idtipocliente == null){
              vm.fData.idtipocliente = vm.listaTiposClientes[0].id;
            }
          });
          // LISTA DE EMPRESAS
          EmpresaServices.sListarEmpresaCbo().then(function (rpta) {
            vm.listaEmpresas = angular.copy(rpta.datos);
            vm.listaEmpresas.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
            if(vm.fData.idempresa == null){
              vm.fData.idempresa = vm.listaEmpresas[0].id;
            }
          });

          vm.aceptar = function () {
            console.log('fdata', vm.fData);
            $uibModalInstance.close(vm.fData);
            PacienteServices.sRegistrarPaciente(vm.fData).then(function (rpta) {
              if(rpta.flag == 1){
                vm.getPaginationServerSide();
              }
            });

          };
          vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        },
        resolve: {
          arrToModal: function() {
            return {
              getPaginationServerSide : vm.getPaginationServerSide,
              // listaSexos : $scope.listaSexos,
              // gridComboOptions : $scope.gridComboOptions,
              // mySelectionComboGrid : $scope.mySelectionComboGrid
            }
          }
        }
      });
    }

  }

  function PacienteServices($http, $q) {
    return({
        sListarPaciente: sListarPaciente,
        sRegistrarPaciente: sRegistrarPaciente,
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
    function sRegistrarPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/registrar_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
  //
})();