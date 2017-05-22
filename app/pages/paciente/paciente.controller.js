(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('PacienteController', PacienteController)
    .service('PacienteServices', PacienteServices);

  /** @ngInject */

  function PacienteController($scope,$uibModal,uiGridConstants, alertify,toastr,
    PacienteServices,TipoClienteServices,EmpresaServices,MotivoConsultaServices) {

    var vm = this;
    // GRILLA PRINCIPAL
      var paginationOptions = {
        pageNumber: 1,
        firstRow: 0,
        pageSize: 10,
        sort: uiGridConstants.DESC,
        sortName: null,
        search: null
      };
      vm.mySelectionGrid = [];
      vm.gridOptions = {
        paginationPageSizes: [10, 50, 100, 500, 1000],
        paginationPageSize: 10,
        enableFiltering: true,
        enableSorting: true,
        useExternalPagination: true,
        useExternalSorting: true,
        useExternalFiltering : true,
        // showGridFooter: true,
        // showColumnFooter: true,
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        multiSelect: false,
        appScopeProvider: vm
      }
      vm.gridOptions.columnDefs = [
        { field: 'idcliente', name:'idcliente', displayName: 'ID', width: 80, },
        { field: 'nombre', name:'nombre', displayName: 'NOMBRE', width: 150, },
        { field: 'apellidos', name:'apellidos', displayName: 'APELLIDOS' },
        { field: 'accion', name:'accion', displayName: 'ACCION', width: 80, enableFiltering: false,
          cellTemplate:'<label class="btn btn-sm text-green" ng-click="grid.appScope.btnEditar(row)"> <i class="fa fa-edit"></i> </label>'+
          '<label class="btn btn-sm text-red" ng-click="grid.appScope.btnAnular(row)"> <i class="fa fa-trash"></i> </label>'
         },

      ];
      vm.gridOptions.onRegisterApi = function(gridApi) {
        vm.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          vm.mySelectionGrid = gridApi.selection.getSelectedRows();
        });
        gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
          vm.mySelectionGrid = gridApi.selection.getSelectedRows();
        });
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          paginationOptions.pageNumber = newPage;
          paginationOptions.pageSize = pageSize;
          paginationOptions.firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
          vm.getPaginationServerSide();
        });
        vm.gridApi.core.on.filterChanged( $scope, function(grid, searchColumns) {
          var grid = this.grid;
          paginationOptions.search = true;
          paginationOptions.searchColumn = {
            'idcliente' : grid.columns[1].filters[0].term,
            'nombre' : grid.columns[2].filters[0].term,
            'apellidos' : grid.columns[3].filters[0].term,
          }
          // console.log('columnas',paginationOptions.searchColumn);
          vm.getPaginationServerSide();
        });
      }

      paginationOptions.sortName = vm.gridOptions.columnDefs[0].name;
      vm.getPaginationServerSide = function() {
        vm.datosGrid = {
          paginate : paginationOptions
        };
        PacienteServices.sListarPaciente(vm.datosGrid).then(function (rpta) {
          vm.gridOptions.data = rpta.datos;
          vm.gridOptions.totalItems = rpta.paginate.totalRows;
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
          backdropClass: 'splash splash-ef-14',
          windowClass: 'splash splash-ef-14',
          // controller: 'ModalInstanceController',
          controller: function($scope, $uibModalInstance, arrToModal ){
            var vm = this;
            vm.fData = {};
            vm.modoEdicion = false;
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
            // LISTA MOTIVO CONSULTA
            MotivoConsultaServices.sListarMotivoConsultaCbo().then(function (rpta) {
              vm.listaMotivos = angular.copy(rpta.datos);
              vm.listaMotivos.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
              if(vm.fData.idmotivoconsulta == null){
                vm.fData.idmotivoconsulta = vm.listaMotivos[0].id;
              }
            });

            vm.aceptar = function () {
              $uibModalInstance.close(vm.fData);
              PacienteServices.sRegistrarPaciente(vm.fData).then(function (rpta) {
                var openedToasts = [];
                vm.options = {
                  timeout: '3000',
                  extendedTimeout: '1000',
                  // closeButton: true,
                  // closeHtml : '<button>&times;</button>',
                  preventDuplicates: false,
                  preventOpenDuplicates: false
                };
                if(rpta.flag == 1){
                  vm.getPaginationServerSide();
                  var title = 'OK';
                  var iconClass = 'success';
                }else if( rpta.flag == 0 ){
                  var title = 'Advertencia';
                  var iconClass = 'warning';
                }else{
                  alert('Ocurrió un error');
                }
                var toast = toastr[iconClass](rpta.message, title, vm.options);
                openedToasts.push(toast);
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
      vm.btnEditar = function(row){

        var modalInstance = $uibModal.open({
          templateUrl: 'app/pages/paciente/paciente_formview.html',
          controllerAs: 'modalPac',
          size: 'lg',
          backdropClass: 'splash splash-2 splash-ef-14',
          windowClass: 'splash splash-2 splash-ef-14',
          // controller: 'ModalInstanceController',
          controller: function($scope, $uibModalInstance, arrToModal ){
            var vm = this;
            var openedToasts = [];
            vm.fData = {};
            vm.fData = arrToModal.seleccion;
            vm.modoEdicion = true;
            vm.getPaginationServerSide = arrToModal.getPaginationServerSide;
            console.log(vm.fData);
            vm.modalTitle = 'Edición de pacientes';
            vm.activeStep = 0;
            vm.listaSexos = [
              { id:'', descripcion:'--Seleccione sexo--' },
              { id:'M', descripcion:'MASCULINO' },
              { id:'F', descripcion:'FEMENINO' }
            ];
            //vm.fData.sexo = vm.listaSexos[0].id;
            // TIPO DE CLIENTE
            TipoClienteServices.sListarTipoClienteCbo().then(function (rpta) {
              vm.listaTiposClientes = angular.copy(rpta.datos);
              vm.listaTiposClientes.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
              if(vm.fData.idtipocliente == null){
                //vm.fData.idtipocliente = vm.listaTiposClientes[0].id;
              }
            });
            // LISTA DE EMPRESAS
            EmpresaServices.sListarEmpresaCbo().then(function (rpta) {
              vm.listaEmpresas = angular.copy(rpta.datos);
              vm.listaEmpresas.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
            });
            // LISTA MOTIVO CONSULTA
            MotivoConsultaServices.sListarMotivoConsultaCbo().then(function (rpta) {
              vm.listaMotivos = angular.copy(rpta.datos);
              vm.listaMotivos.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
            });

            vm.aceptar = function () {
              console.log('edicion...', vm.fData);
              $uibModalInstance.close(vm.fData);
              PacienteServices.sEditarPaciente(vm.fData).then(function (rpta) {
                vm.options = {
                  timeout: '3000',
                  extendedTimeout: '1000',
                  // closeButton: true,
                  // closeHtml : '<button>&times;</button>',
                  progressBar: true,
                  preventDuplicates: false,
                  preventOpenDuplicates: false
                };
                if(rpta.flag == 1){
                  vm.getPaginationServerSide();
                  var title = 'OK';
                  var iconClass = 'success';
                }else if( rpta.flag == 0 ){
                  var title = 'Advertencia';
                  // vm.toast.title = 'Advertencia';
                  var iconClass = 'warning';
                  // vm.options.iconClass = {name:'warning'}
                }else{
                  alert('Ocurrió un error');
                }
                var toast = toastr[iconClass](rpta.message, title, vm.options);
                openedToasts.push(toast);
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
                seleccion : row.entity
                // listaSexos : $scope.listaSexos,
                // gridComboOptions : $scope.gridComboOptions,
                // mySelectionComboGrid : $scope.mySelectionComboGrid
              }
            }
          }
        });
      }
      vm.btnAnular = function(row){
        alertify.confirm("¿Realmente desea realizar la acción?", function (ev) {
          ev.preventDefault();
          PacienteServices.sAnularPaciente(row.entity).then(function (rpta) {
            var openedToasts = [];
            vm.options = {
              timeout: '3000',
              extendedTimeout: '1000',
              // closeButton: true,
              // closeHtml : '<button>&times;</button>',
              preventDuplicates: false,
              preventOpenDuplicates: false
            };
            if(rpta.flag == 1){
              vm.getPaginationServerSide();
              var title = 'OK';
              var iconClass = 'success';
            }else if( rpta.flag == 0 ){
              var title = 'Advertencia';
              var iconClass = 'warning';
            }else{
              alert('Ocurrió un error');
            }
            var toast = toastr[iconClass](rpta.message, title, vm.options);
            openedToasts.push(toast);
          });
        }, function(ev) {
            ev.preventDefault();
        });


      }

  }

  function PacienteServices($http, $q) {
    return({
        sListarPaciente: sListarPaciente,
        sListaPacientesAutocomplete: sListaPacientesAutocomplete,
        sRegistrarPaciente: sRegistrarPaciente,
        sEditarPaciente: sEditarPaciente,
        sAnularPaciente: sAnularPaciente,
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
    function sListaPacientesAutocomplete(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/lista_pacientes_autocomplete",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sRegistrarPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/registrar_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sEditarPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/editar_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sAnularPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/anular_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
  //
})();