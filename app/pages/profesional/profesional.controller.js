(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('ProfesionalController', ProfesionalController)
    .service('ProfesionalServices', ProfesionalServices);

  /** @ngInject */
  function ProfesionalController($scope,$uibModal,$timeout,$filter,filterFilter, uiGridConstants,$document, alertify,toastr,ProfesionalServices,EspecialidadServices,GrupoServices,UsuarioServices) {

    var vm = this;
    vm.selectedItem = {};
    vm.options = {};
    vm.fDemo = {};

    vm.remove = function(scope) {
      scope.remove();
    };

    vm.toggle = function(scope) {
      scope.toggle();
    };

    vm.expandAll = function() {
      vm.$broadcast('angular-ui-tree:expand-all');
    };

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
        enableRowHeaderSelection: false,
        enableFullRowSelection: true,
        multiSelect: false,
        appScopeProvider: vm
      }
      vm.gridOptions.columnDefs = [
        { field: 'idprofesional', name:'idprofesional', displayName: 'ID', width: 80, enableFiltering: false, },
        { field: 'especialidad', name:'especialidad', displayName: 'ESPECIALIDAD', width: 200, },
        { field: 'nombre', name:'nombre', displayName: 'NOMBRE' },
        { field: 'apellidos', name:'apellidos', displayName: 'APELLIDOS', width: 150, },
        { field: 'correo', name:'correo', displayName: 'CORREO', width: 150, },
        { field: 'fecha_nacimiento', name:'fecha_nacimiento', displayName: 'FEC.NACIMIENTO', enableFiltering: false, },        
        { field: 'accion', name:'accion', displayName: 'ACCION', width: 80, enableFiltering: false,
          cellTemplate:'<label class="btn btn-sm text-primary" ng-click="grid.appScope.btnEditar(row);$event.stopPropagation();" tooltip-placement="left" uib-tooltip="EDITAR"> <i class="fa fa-edit"></i> </label>'+
          '<label class="btn btn-sm text-red" ng-click="grid.appScope.btnAnular(row);$event.stopPropagation();"> <i class="fa fa-trash" tooltip-placement="left" uib-tooltip="ELIMINAR!"></i> </label>'
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
            'e.especilidad' : grid.columns[2].filters[0].term,
            'p.nombre' : grid.columns[3].filters[0].term,
            'p.apellidos' : grid.columns[4].filters[0].term,
            'correo' : grid.columns[5].filters[0].term,        
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
        ProfesionalServices.sListarProfesional(vm.datosGrid).then(function (rpta) {
          vm.gridOptions.data = rpta.datos;
          vm.gridOptions.totalItems = rpta.paginate.totalRows;
          vm.mySelectionGrid = [];
        });
      }
      vm.getPaginationServerSide();
      /*---------- NUEvA EMPRESA--------*/
      vm.btnNuevo = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/pages/profesional/profesional_formview.html',
          controllerAs: 'mp',
          size: 'md',
          backdropClass: 'splash splash-2 splash-ef-14',
          windowClass: 'splash splash-2 splash-ef-14',          
          controller: function($scope, $uibModalInstance, arrToModal ){
            var vm = this;
            vm.fData = {};
            vm.modoEdicion = false;
            vm.getPaginationServerSide = arrToModal.getPaginationServerSide;
            vm.modalTitle = 'Registro de Profesional';

            EspecialidadServices.sListarEspecialidad().then(function (rpta) {
              vm.listaEspecialidades = angular.copy(rpta.datos);
              vm.fData.idespecialidad = vm.listaEspecialidades[0];
            });

            // DATEPICKER
            vm.today = function() {
              vm.fData.fecha_nacimiento = new Date();
            };

            vm.clear = function() {
              vm.fData.fecha_nacimiento = null;
            };
            vm.today();
            vm.inlineOptions = {
              minDate: new Date(),
              showWeeks: false
            };

            vm.dateOptions = {
              maxDate: new Date(2020, 5, 22),
              minDate: new Date(),
              startingDay: 1,
              showWeeks: false
            };

            vm.toggleMin = function() {
              vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
              vm.dateOptions.minDate = vm.inlineOptions.minDate;
            };

            vm.toggleMin();

            vm.open1 = function() {
              vm.popup1.opened = true;
            };

            vm.setDate = function(year, month, day) {
              vm.fData.fecha_nacimiento = new Date(year, month, day);
            };

            vm.formats = ['dd-MM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            vm.format = vm.formats[0];
            vm.altInputFormats = ['d!/M!/yyyy'];

            vm.popup1 = {
              opened: false
            };
            // FIN DATAPICKER
            vm.getUsuarioAutocomplete = function (value) {
              var params = {};
              params.search= value;
              params.sensor= false;
                
              return UsuarioServices.sListaUsuarioAutocomplete(params).then(function(rpta) { 
                vm.noResultsLM = false;
                if( rpta.flag === 0 ){
                  vm.noResultsLM = true;
                }
                return rpta.datos; 
              });
            }

            vm.getSelectedUsuario = function($item, $model, $label){
              vm.fData.usuario = $item;
              vm.fData.idusuario = $model.idusuario;              
            }             

            /*------------  REGISTRO USUARIO  -----------------*/
            vm.user = function(){
              var modalInstance = $uibModal.open({
                templateUrl: 'user.html',
                controllerAs: 'us',
                size: 'md',
                backdropClass: 'splash',
                windowClass: 'splash',          
                controller: function($scope, $uibModalInstance, data ,arrToModal ){
                  var vm = this;
                  vm.fData = {};
                  vm.modoEdicion = false;
                  vm.getPaginationServerSide = arrToModal.getPaginationServerSide;
                  vm.modalTitle = 'Registro de Usuario';

                  GrupoServices.sListarGrupo().then(function (rpta) {
                    vm.listaGrupo = angular.copy(rpta.datos);
                    vm.fData.idgrupo = vm.listaGrupo[0];
                  });
                  // BOTONES
                  vm.aceptar = function () {
                    UsuarioServices.sRegistrarUsuario(vm.fData).then(function (rpta) {
                      var openedToasts = [];
                      vm.options = {
                        timeout: '3000',
                        extendedTimeout: '1000',
                        preventDuplicates: false,
                        preventOpenDuplicates: false
                      };
                      if(rpta.flag == 1){
                        //$uibModalInstance.close(vm.fData);
                        data.usuario = vm.fData.username;
                        data.idusuario = rpta.datos;
                        $uibModalInstance.close();                        
                        //vm.getPaginationServerSide();
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
                  data : function() { return vm.fData},
                  arrToModal: function() {
                    return {
                      getPaginationServerSide : vm.getPaginationServerSide,
                      

                    }
                  }
                }
              });              
            }

            /*------------  FIN REGISTRO USUARIO  ------------*/            
            // BOTONES
            vm.aceptar = function () {
              vm.fData.fecha_nacimiento = $filter('date')(new Date(vm.fData.fecha_nacimiento), 'yyyy-MM-dd ');
              ProfesionalServices.sRegistrarProfesional(vm.fData).then(function (rpta) {
                var openedToasts = [];
                vm.options = {
                  timeout: '3000',
                  extendedTimeout: '1000',
                  preventDuplicates: false,
                  preventOpenDuplicates: false
                };
                if(rpta.flag == 1){
                  $uibModalInstance.close(vm.fData);
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

              }
            }
          }
        });
      }
      /*-------- BOTONES DE EDICION ----*/
      vm.btnEditar = function(row){//datos personales
        var modalInstance = $uibModal.open({
          templateUrl: 'app/pages/profesional/profesional_formview.html',
          controllerAs: 'mp',
          size: 'md',
          backdropClass: 'splash splash-2 splash-ef-14',
          windowClass: 'splash splash-2 splash-ef-14',
          // controller: 'ModalInstanceController',
          controller: function($scope, $uibModalInstance, arrToModal ){
            var vm = this;
            var openedToasts = [];
            vm.fData = {};
            vm.fData = angular.copy(arrToModal.seleccion);
            console.log("row",vm.fData);
            vm.modoEdicion = true;
            vm.getPaginationServerSide = arrToModal.getPaginationServerSide;

            vm.modalTitle = 'Edición de Profesional';
            EspecialidadServices.sListarEspecialidad().then(function (rpta) {
              vm.listaEspecialidades = angular.copy(rpta.datos);
              vm.fData.idespecialidad = vm.listaEspecialidades[0];
            });

            // DATEPICKER
            vm.today = function() {             
              vm.fData.fecha_nacimiento = new Date(vm.fData.fecha_nacimiento_for+'T23:00:00');
            };

            vm.clear = function() {
              vm.fData.fecha_nacimiento = null;
            };
            vm.today();
            vm.inlineOptions = {
              minDate: new Date(),
              showWeeks: false
            };

            vm.dateOptions = {
              maxDate: new Date(2020, 5, 22),
              minDate: new Date(),
              startingDay: 1,
              showWeeks: false
            };

            vm.toggleMin = function() {
              vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
              vm.dateOptions.minDate = vm.inlineOptions.minDate;
            };

            vm.toggleMin();

            vm.open1 = function() {
              vm.popup1.opened = true;
            };

            vm.setDate = function(year, month, day) {
              vm.fData.fecha_nacimiento = new Date(year, month, day);
            };

            vm.formats = ['dd-MM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            vm.format = vm.formats[0];
            vm.altInputFormats = ['d!/M!/yyyy'];

            vm.popup1 = {
              opened: false
            };
            // FIN DATAPICKER
            vm.getUsuarioAutocomplete = function (value) {
              var params = {};
              params.search= value;
              params.sensor= false;
                
              return UsuarioServices.sListaUsuarioAutocomplete(params).then(function(rpta) { 
                vm.noResultsLM = false;
                if( rpta.flag === 0 ){
                  vm.noResultsLM = true;
                }
                return rpta.datos; 
              });
            } 
            vm.getSelectedUsuario = function($item, $model, $label){
              vm.fData.usuario = $item;
              vm.fData.idusuario = $model.idusuario;
            }             
            /*------------  REGISTRO USUARIO  -----------------*/
            vm.user = function(){
              var modalInstance = $uibModal.open({
                templateUrl: 'user.html',
                controllerAs: 'us',
                size: 'md',
                backdropClass: 'splash',
                windowClass: 'splash',          
                controller: function($scope, $uibModalInstance, data ,arrToModal ){
                  var vm = this;
                  vm.fData = {};
                  vm.modoEdicion = false;
                  vm.getPaginationServerSide = arrToModal.getPaginationServerSide;
                  vm.modalTitle = 'Registro de Usuario';

                  GrupoServices.sListarGrupo().then(function (rpta) {
                    vm.listaGrupo = angular.copy(rpta.datos);
                    vm.fData.idgrupo = vm.listaGrupo[0];
                  });
                  // BOTONES
                  vm.aceptar = function () {
                    UsuarioServices.sRegistrarUsuario(vm.fData).then(function (rpta) {
                      var openedToasts = [];
                      vm.options = {
                        timeout: '3000',
                        extendedTimeout: '1000',
                        preventDuplicates: false,
                        preventOpenDuplicates: false
                      };
                      if(rpta.flag == 1){
                        //$uibModalInstance.close(vm.fData);
                        data.usuario = vm.fData.username;
                        data.idusuario = rpta.datos;
                        $uibModalInstance.close();                        
                        //vm.getPaginationServerSide();
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
                  data : function() { return vm.fData},
                  arrToModal: function() {
                    return {
                      getPaginationServerSide : vm.getPaginationServerSide,
                      

                    }
                  }
                }
              });              
            }
            /*------------  FIN REGISTRO USUARIO  ------------*/                        
            vm.aceptar = function () {
              vm.fData.fecha_nacimiento = $filter('date')(new Date(vm.fData.fecha_nacimiento), 'yyyy-MM-dd ');
              ProfesionalServices.sEditarProfesional(vm.fData).then(function (rpta) {
                vm.options = {
                  timeout: '3000',
                  extendedTimeout: '1000',
                  progressBar: true,
                  preventDuplicates: false,
                  preventOpenDuplicates: false
                };
                if(rpta.flag == 1){
                  vm.getPaginationServerSide();
                  $uibModalInstance.close();
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
                seleccion : row.entity
              }
            }
          }
        });
      }

      vm.btnAnular = function(row){
        alertify.confirm("¿Realmente desea realizar la acción?", function (ev) {
          ev.preventDefault();
          ProfesionalServices.sAnularProfesional(row.entity).then(function (rpta) {
            var openedToasts = [];
            vm.options = {
              timeout: '3000',
              extendedTimeout: '1000',
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
  function ProfesionalServices($http, $q) {
    return({
        sListarProfesional: sListarProfesional,
        sListarProfesionalCbo: sListarProfesionalCbo,
        sRegistrarProfesional: sRegistrarProfesional,
        sEditarProfesional: sEditarProfesional,
        sAnularProfesional: sAnularProfesional,
    });
    function sListarProfesional(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "profesional/listar_profesional",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }    
    function sListarProfesionalCbo(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "profesional/listar_profesional_cbo",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
    function sRegistrarProfesional(pDatos) {
      var datos = pDatos || {};      
      var request = $http({
            method : "post",
            url : angular.patchURLCI + "profesional/registrar_profesional",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }   
    function sEditarProfesional(pDatos) {
      var datos = pDatos || {};      
      var request = $http({
            method : "post",
            url : angular.patchURLCI + "profesional/editar_profesional",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }  
    function sAnularProfesional(pDatos) {
      var datos = pDatos || {};      
      var request = $http({
            method : "post",
            url : angular.patchURLCI + "profesional/anular_profesional",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }         
  }
})();
