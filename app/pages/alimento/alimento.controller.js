(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('AlimentoController', AlimentoController)
    .service('AlimentoServices', AlimentoServices);

  /** @ngInject */

  function AlimentoController($scope,$uibModal,uiGridConstants,alertify,toastr, 
    AlimentoServices) {

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
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        multiSelect: false,
        appScopeProvider: vm
      }
      vm.gridOptions.columnDefs = [ 
        { field: 'idalimento', name:'idalimento', displayName: 'ID', minWidth: 30, sort: { direction: uiGridConstants.DESC} },
        { field: 'grupo1', name:'descripcion_gr1', displayName: 'GRUPO 1', minWidth: 160 },
        { field: 'grupo2', name:'descripcion_gr2', displayName: 'GRUPO 2', minWidth: 160 },
        { field: 'alimento', name:'nombre', displayName: 'ALIMENTO', minWidth: 300 },
        { field: 'calorias', name:'calorias', displayName: 'CALORÍAS', minWidth: 80 },
        { field: 'proteinas', name:'proteinas', displayName: 'PROTEÍNAS', minWidth: 80 },
        { field: 'grasas', name:'grasas', displayName: 'GRASAS', minWidth: 80 },
        { field: 'carbohidratos', name:'carbohidratos', displayName: 'CARBOHIDRATOS', minWidth: 80 },
        { field: 'accion', name:'accion', displayName: 'ACCION', minWidth: 80, enableFiltering: false,
          cellTemplate: '<div class="text-center">' +  
          '<button class="btn btn-default btn-sm text-green btn-action" ng-click="grid.appScope.btnEditar(row)"> <i class="fa fa-edit"></i> </button>'+
          '<button class="btn btn-default btn-sm text-red btn-action" ng-click="grid.appScope.btnAnular(row)"> <i class="fa fa-trash"></i> </button>' + 
          '</div>' 
        } 
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
            'al.idalimento' : grid.columns[1].filters[0].term,
            'gr1.descripcion_gr1' : grid.columns[2].filters[0].term,
            'gr2.descripcion_gr2' : grid.columns[3].filters[0].term,
            'al.nombre' : grid.columns[4].filters[0].term,
            'al.calorias' : grid.columns[5].filters[0].term,
            'al.proteinas' : grid.columns[6].filters[0].term,
            'al.grasas' : grid.columns[7].filters[0].term,
            'al.carbohidratos' : grid.columns[8].filters[0].term 
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
        AlimentoServices.sListarAlimentos(vm.datosGrid).then(function (rpta) {
          vm.gridOptions.data = rpta.datos;
          vm.gridOptions.totalItems = rpta.paginate.totalRows;
          vm.mySelectionGrid = [];
        });
      }
      vm.getPaginationServerSide();
    // MANTENIMIENTO
      vm.btnNuevo = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/pages/alimento/alimento_formview.html',
          controllerAs: 'modalAli',
          size: 'md',
          backdropClass: 'splash',
          windowClass: 'splash',
          // controller: 'ModalInstanceController',
          controller: function($scope, $uibModalInstance, arrToModal ){
            var vm = this;
            vm.fData = {};
            vm.modoEdicion = false;
            vm.getPaginationServerSide = arrToModal.getPaginationServerSide;
            vm.modalTitle = 'Registro de alimentos';
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
              AlimentoServices.sRegistrarPaciente(vm.fData).then(function (rpta) {
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
              AlimentoServices.sEditarPaciente(vm.fData).then(function (rpta) {
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
          AlimentoServices.sAnularPaciente(row.entity).then(function (rpta) {
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

  function AlimentoServices($http, $q) {
    return({
        sListarAlimentos: sListarAlimentos,
        sListaAlimentosAutocomplete: sListaAlimentosAutocomplete,
        sRegistrarPaciente: sRegistrarPaciente,
        sEditarPaciente: sEditarPaciente,
        sAnularPaciente: sAnularPaciente,
    });
    function sListarAlimentos(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Alimentos/listar_alimentos",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
    function sListaAlimentosAutocomplete(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Alimentos/lista_alimentos_autocomplete",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sRegistrarPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Alimentos/registrar_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sEditarPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Alimentos/editar_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sAnularPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Alimentos/anular_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
  //
})();