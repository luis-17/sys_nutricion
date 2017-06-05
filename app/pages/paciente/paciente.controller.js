(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('PacienteController', PacienteController)
    .service('PacienteServices', PacienteServices);

  /** @ngInject */

  function PacienteController($scope,$uibModal,$timeout,filterFilter, uiGridConstants,$document, alertify,toastr,
    PacienteServices,TipoClienteServices,EmpresaServices,MotivoConsultaServices,AntecedenteServices) {

    var vm = this;
    vm.modoFicha = false;
    vm.modoEditar = false;
    vm.fotoCrop = false;
    vm.ficha = {}
    vm.previo0 = true;
    vm.previo1 = false;
    vm.previo2 = false;
    var openedToasts = [];
    // LISTA DE TABS DE LA FICHA
      vm.templates = [
        { tab: 'Evolución', url: 'app/pages/paciente/ficha_evolucion.html'},
        { tab: 'Datos Personales', url: 'app/pages/paciente/ficha_datos_personales.html'},
        { tab: 'Antecedentes', url: 'app/pages/paciente/ficha_antecedentes.html'},
        { tab: 'Hábitos', url: 'app/pages/paciente/ficha_habitos.html'},
        { tab: 'Consultas', url: 'app/pages/paciente/ficha_consultas.html'},
        { tab: 'Planes Alimentarios', url: 'app/pages/paciente/ficha_planes.html'},
      ];
      // LISTAS VARIAS
      vm.listaSexos = [
        { id:'', descripcion:'--Seleccione sexo--' },
        { id:'M', descripcion:'MASCULINO' },
        { id:'F', descripcion:'FEMENINO' }
      ];
      vm.actividadFisica = [
        { id: 'NR', descripcion: 'No realiza' },
        { id: 'LE', descripcion: 'Leve' },
        { id: 'MO', descripcion: 'Moderado' },
      ];
      vm.frecuencia = [
        { id: '', descripcion: '--' },
        { id: '1s', descripcion: 'Una vez a la semana' },
        { id: '2s', descripcion: 'Dos veces a la semana' },
        { id: '3s', descripcion: 'Tres veces a la semana' },
        { id: '4s', descripcion: 'Cuatro veces a la semana' },
        { id: '5s', descripcion: 'Cinco veces a la semana' },
        { id: '6s', descripcion: 'Seis veces a la semana' },
        { id: 'all', descripcion: 'Todos los días' },
      ];
      vm.consumoAgua = [
        { id: '-2L', descripcion : 'Menos de 2L' },
        { id: '2L', descripcion : '2L' },
        { id: '+2L', descripcion : 'Mas de 2L' },
      ];
      vm.consumos = [
        { id: 'NC', descripcion: 'No consume'},
        { id: 'OC', descripcion: 'Ocasional'},
        { id: 'FR', descripcion: 'Frecuente'},
        { id: 'EX', descripcion: 'Excesivo'},
      ]
      vm.tiempoSuenio = [
        { id: 'P', descripcion : 'Poco' },
        { id: 'A', descripcion : 'Adecuado' },
        { id: 'E', descripcion : 'Excesivo' },
      ];
      vm.listaHoras = [
        { id: '--', descripcion: '--'},
        { id: '01', descripcion: '01'},
        { id: '02', descripcion: '02'},
        { id: '03', descripcion: '03'},
        { id: '04', descripcion: '04'},
        { id: '05', descripcion: '05'},
        { id: '06', descripcion: '06'},
        { id: '07', descripcion: '07'},
        { id: '08', descripcion: '08'},
        { id: '09', descripcion: '09'},
        { id: '10', descripcion: '10'},
        { id: '11', descripcion: '11'},
        { id: '12', descripcion: '12'},
      ];
      vm.listaMinutos = [
        { id: '--', descripcion: '--'},
        { id: '00', descripcion: '00'},
        { id: '15', descripcion: '15'},
        { id: '30', descripcion: '30'},
        { id: '45', descripcion: '45'},
      ];
      vm.listaPeriodos = [
        { id: 'am', descripcion: 'am'},
        { id: 'pm', descripcion: 'pm'},
      ];

      // TIPO DE CLIENTE
      TipoClienteServices.sListarTipoClienteCbo().then(function (rpta) {
        vm.listaTiposClientes = angular.copy(rpta.datos);
        vm.listaTiposClientes.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
        // if(vm.fData.idtipocliente == null){
        //   vm.fData.idtipocliente = vm.listaTiposClientes[0].id;
        // }
      });
      // LISTA DE EMPRESAS
      EmpresaServices.sListarEmpresaCbo().then(function (rpta) {
        vm.listaEmpresas = angular.copy(rpta.datos);
        vm.listaEmpresas.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
        // if(vm.fData.idempresa == null){
        //   vm.fData.idempresa = vm.listaEmpresas[0].id;
        // }
      });
      // LISTA MOTIVO CONSULTA
        MotivoConsultaServices.sListarMotivoConsultaCbo().then(function (rpta) {
          vm.listaMotivos = angular.copy(rpta.datos);
          vm.listaMotivos.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
          // if(vm.fData.idmotivoconsulta == null){
          //   vm.fData.idmotivoconsulta = vm.listaMotivos[0].id;
          // }
        });
        vm.cambiaTipoCliente = function(){
          vm.fData.idempresa = vm.listaEmpresas[0].id;
          if(vm.fData.idtipocliente == 3 ){
            vm.corp = true;
          }else{
            vm.corp = false;
          }
        }
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
        enableRowHeaderSelection: false,
        enableFullRowSelection: true,
        multiSelect: false,
        appScopeProvider: vm
      }
      vm.gridOptions.columnDefs = [
        { field: 'idcliente', name:'idcliente', displayName: 'ID', width: 80, },
        { field: 'nombre', name:'nombre', displayName: 'NOMBRE', width: 150, },
        { field: 'apellidos', name:'apellidos', displayName: 'APELLIDOS' },
        { field: 'accion', name:'accion', displayName: 'ACCION', width: 80, enableFiltering: false,
          cellTemplate:'<label class="btn btn-sm text-green" ng-click="grid.appScope.btnVerFicha(row);$event.stopPropagation();" tooltip-placement="left" uib-tooltip="VER FICHA!"> <i class="fa fa-eye"></i> </label>'+
          '<label class="btn btn-sm text-red" ng-click="grid.appScope.btnAnular(row);$event.stopPropagation();"> <i class="fa fa-trash" tooltip-placement="left" uib-tooltip="ELIMINAR!"></i> </label>'
         },

      ];
      vm.gridOptions.onRegisterApi = function(gridApi) {
        vm.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          vm.mySelectionGrid = gridApi.selection.getSelectedRows();
          if( vm.mySelectionGrid[0] ){
            PacienteServices.sListarUltimaConsulta(row.entity).then(function(rpta){
              vm.mySelectionGrid[0].peso = rpta.datos.peso;
              if(vm.mySelectionGrid[0].estatura > 50){
                vm.mySelectionGrid[0].imc = (vm.mySelectionGrid[0].peso / ((vm.mySelectionGrid[0].estatura/100)*(vm.mySelectionGrid[0].estatura/100))).toFixed(2);
              }
            });
          }
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
            'cl.idcliente' : grid.columns[1].filters[0].term,
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
        PacienteServices.sListarPacientes(vm.datosGrid).then(function (rpta) {
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
            // vm.activeStep = 0;
            vm.corp = false; // solo para tipo de cliente = corporativo sera true
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
            vm.cambiaTipoCliente = function(){
              vm.fData.idempresa = vm.listaEmpresas[0].id;
              if(vm.fData.idtipocliente == 3 ){
                vm.corp = true;
              }else{
                vm.corp = false;
              }
            }
            // SUBIDA DE IMAGENES MEDIANTE IMAGE CROP
              vm.fData.myImage='';
              vm.fData.myCroppedImage='';
              vm.cropType='square';

              var handleFileSelect=function(evt) {
                var file = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                  /* eslint-disable */
                  $scope.$apply(function(){
                    vm.fData.myImage=evt.target.result;
                  });
                  /* eslint-enable */
                };
                reader.readAsDataURL(file);
              };
              $timeout(function() { // lo pongo dentro de un timeout sino no funciona
                angular.element($document[0].querySelector('#fileInput')).on('change',handleFileSelect);
              }/* no delay here */);
            // BOTONES
            vm.aceptar = function () {
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
                // document: $document,
                // listaSexos : $scope.listaSexos,
                // gridComboOptions : $scope.gridComboOptions,
                // mySelectionComboGrid : $scope.mySelectionComboGrid
              }
            }
          }
        });
      }
      vm.btnVerFicha = function(row){
        vm.modoFicha = true;
        vm.mySelectionGrid = [row.entity];
        PacienteServices.sListarUltimaConsulta(row.entity).then(function(rpta){
          vm.mySelectionGrid[0].peso = rpta.datos.peso;
          if(vm.mySelectionGrid[0].estatura > 50){
            vm.mySelectionGrid[0].imc = (vm.mySelectionGrid[0].peso / ((vm.mySelectionGrid[0].estatura/100)*(vm.mySelectionGrid[0].estatura/100))).toFixed(2);
          }
        });
        vm.ficha = {}

        vm.ficha = angular.copy(row.entity);
        vm.ficha.cambiaPatologico = false;
        vm.ficha.cambiaHeredado = false;

        vm.cargarAntecedentes(row.entity);
        vm.cargarHabitosAlimentarios(row.entity);
        vm.cargarHabitos(row.entity);
        vm.cargarEvolucion(row.entity);

      }
      // CARGAR GRAFICO
        vm.cargarEvolucion = function(row){
          PacienteServices.slistarEvolucion(row).then(function(rpta){
            console.log('rpta', rpta.datos.peso);
            vm.dataEvolucion = rpta.datos.peso;
            // vm.dataEvolucion = [
            //   { y: "2006", a: 100},
            //   { y: "2007", a: 75 },
            //   { y: "2008", a: 50 },
            //   { y: "2009", a: 75 },
            //   { y: "2010", a: 50 },
            //   { y: "2011", a: 75 },
            //   { y: "2012", a: 100 }
            // ]
          });
        }
      // SUBIDA DE IMAGENES MEDIANTE IMAGE CROP
        vm.cargarImagen = function(){
          vm.fotoCrop = true;
          vm.image = {
             originalImage: '',
             croppedImage: '',
          };
          vm.cropType='circle';

          var handleFileSelect2=function(evt) {
            var file = evt.currentTarget.files[0];
            // if (file.type !== "image/jpeg" && file.type !== "image/jpg" && file.type !== "image/png") {
            //       // notify({
            //       //     message: 'Only .jpg and .png files are accepted!',
            //       //     classes: ["alert-danger"]
            //       // });
            //       alert('Solo se permiten imagenes');
            //       return false;
            //   }
            //   if (file.size > 4194304) {
            //       // notify({
            //       //     message: 'Max file size is 4mb!',
            //       //     classes: ["alert-danger"]
            //       // });
            //       alert('Max. 4Mb');
            //       return false;
            //   }
            var reader = new FileReader();
            reader.onload = function (evt) {
              /* eslint-disable */
              $scope.$apply(function($scope){
                vm.image.originalImage=evt.target.result;
                // vm.image.fotoNueva=evt.target.result;
                console.log("foto", vm.image);
              });
              /* eslint-enable */
            };
            reader.readAsDataURL(file);
          };
          $timeout(function() { // lo pongo dentro de un timeout sino no funciona
            angular.element($document[0].querySelector('#fileInput2')).on('change',handleFileSelect2);
          });
        }
        vm.subirFoto = function(){
          vm.image.nombre_foto = vm.ficha.nombre_foto;
          vm.image.idcliente = vm.ficha.idcliente;
          vm.image.nombre = vm.ficha.nombre;
          PacienteServices.sSubirFoto(vm.image).then(function(rpta){
            if(rpta.flag == 1){
              var title = 'OK';
              var iconClass = 'success';
              vm.ficha.nombre_foto = rpta.datos;
              vm.fotoCrop = false;
              vm.image = {
                 originalImage: '',
                 croppedImage: '',
              };

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
        }
        vm.cancelarFoto = function(){
          vm.fotoCrop = false;
          vm.image = {
             originalImage: '',
             croppedImage: '',
          };
        }
      vm.cargarAntecedentes = function(row){
        PacienteServices.sListarAntecedentesPaciente(row).then(function (rpta) {
          vm.listaAntPatologicos = rpta.datos.patologicos;
          vm.listaAntHeredados = rpta.datos.heredados;
          vm.ficha.antPatologicos = angular.copy(vm.listaAntPatologicos);
          vm.ficha.antHeredados = angular.copy(vm.listaAntHeredados);
        });
      }
      vm.cargarHabitosAlimentarios = function(row){
        PacienteServices.sListarHabitosAlimPaciente(row).then(function (rpta) {
          vm.ficha.listaHabitosAlim = rpta.datos;
        });
      }
      vm.cargarHabitos = function(row){
        PacienteServices.sListarHabitosPaciente(row).then(function (rpta) {
          vm.ficha.habitos = rpta.datos;
        });
      }
      vm.cambiarCheckPatologico = function(item,index){
        if(vm.modoEditar == true){
          vm.ficha.cambiaPatologico = true;
          angular.forEach(vm.ficha.antPatologicos, function(value, key) {
            if(key == index){
              if(value.check == 1)
                vm.ficha.antPatologicos[index].check = 0;
              else
                vm.ficha.antPatologicos[index].check = 1;
            }
          });
          vm.listaAntPatologicos = angular.copy(vm.ficha.antPatologicos);
        }
      }
      vm.cambiarCheckHeredado = function(item,index){
        if(vm.modoEditar == true){
        vm.ficha.cambiaHeredado = true;
          angular.forEach(vm.ficha.antHeredados, function(value, key) {
            if(key == index){
              if(value.check == 1)
                vm.ficha.antHeredados[index].check = 0;
              else
                vm.ficha.antHeredados[index].check = 1;
            }
          });
          vm.listaAntHeredados = angular.copy(vm.ficha.antHeredados);
        }
      }
      vm.btnAceptarTab2 = function(datos){//datos personales
        PacienteServices.sEditarPaciente(datos).then(function (rpta) {
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
            vm.modoEditar = false;
            // vm.getPaginationServerSide();
            PacienteServices.sListarPacientePorId(datos).then(function (rpta) {
              vm.ficha = rpta.datos;
              vm.mySelectionGrid = [rpta.datos];
            });
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
      }
      vm.btnCancelarTab2 = function(){
        vm.modoEditar = false;
        vm.ficha = angular.copy(vm.mySelectionGrid[0]);
      }
      vm.btnAceptarTab3 = function(){// antecedentes
        console.log('array',vm.listaAntPatologicos);
        PacienteServices.sRegistrarAntecedentePaciente(vm.ficha).then(function (rpta) {
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
            vm.modoEditar = false;
            // vm.getPaginationServerSide();
            // PacienteServices.sListarPacientePorId(datos).then(function (rpta) {
            //   vm.ficha = rpta.datos;
            //   vm.mySelectionGrid = [rpta.datos];
            // });
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
      }
      vm.btnCancelarTab3 = function(){
        vm.modoEditar = false;
        vm.ficha = angular.copy(vm.mySelectionGrid[0]);
        vm.cargarAntecedentes(vm.ficha);
      }
      vm.btnAceptarTab4 = function(){
        vm.ficha.habitos.idcliente = vm.ficha.idcliente;
        vm.ficha.habitos.alimentarios = vm.ficha.listaHabitosAlim;
        PacienteServices.sRegistrarHabitoPaciente(vm.ficha.habitos).then(function (rpta) {
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
            vm.modoEditar = false;
            vm.cargarHabitos(vm.ficha);
            vm.cargarHabitosAlimentarios(vm.ficha);
            var title = 'OK',
                iconClass = 'success';
          }else if( rpta.flag == 0 ){
            var title = 'Advertencia',
                iconClass = 'warning';
            // vm.options.iconClass = {name:'warning'}
          }else{
            alert('Ocurrió un error');
          }
          var toast = toastr[iconClass](rpta.message, title, vm.options);
          openedToasts.push(toast);
        });
      }
      vm.btnCancelarTab4 = function(){
        vm.modoEditar = false;
        vm.ficha = angular.copy(vm.mySelectionGrid[0]);
        vm.cargarHabitosAlimentarios(vm.ficha);
        vm.cargarHabitos(vm.ficha);
      }
      vm.btnRegresar = function(){
        vm.modoFicha = false;
        vm.fotoCrop = false;
        vm.image = {
           originalImage: '',
           croppedImage: '',
        };
        vm.getPaginationServerSide();
      }
      vm.verPrevio = function(index){
        console.log('index: ', index);
        if(index == 0){
          vm.previo0 = true;
          vm.previo1 = false;
          vm.previo2 = false;
        }else if(index == 1){
          vm.previo0 = false;
          vm.previo1 = true;
          vm.previo2 = false;
        }else{
          vm.previo0 = false;
          vm.previo1 = false;
          vm.previo2 = true;
        }
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
        sListarPacientes: sListarPacientes,
        sListaPacientesAutocomplete: sListaPacientesAutocomplete,
        sListarHabitosAlimPaciente: sListarHabitosAlimPaciente,
        sListarHabitosPaciente: sListarHabitosPaciente,
        sListarAntecedentesPaciente: sListarAntecedentesPaciente,
        sListarPacientePorId: sListarPacientePorId,
        sListarUltimaConsulta: sListarUltimaConsulta,
        sRegistrarPaciente: sRegistrarPaciente,
        sEditarPaciente: sEditarPaciente,
        sAnularPaciente: sAnularPaciente,
        sRegistrarAntecedentePaciente: sRegistrarAntecedentePaciente,
        sRegistrarHabitoPaciente: sRegistrarHabitoPaciente,
        sSubirFoto: sSubirFoto,
        slistarEvolucion: slistarEvolucion,
    });
    function sListarPacientes(pDatos) {
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
    function sListarHabitosAlimPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/listar_habitos_alim_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sListarHabitosPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/listar_habitos_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sListarAntecedentesPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/listar_antecedentes_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sListarPacientePorId(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/listar_paciente_por_id",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sListarUltimaConsulta(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Consulta/listar_ultima_consulta",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sRegistrarPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/registrar_paciente",
            data : datos,
            // transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            // transformRequest: function(obj) {
            //     var str = [];
            //     for(var p in obj)
            //     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            //     return str.join("&");
            // },
            transformRequest: function (data) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });
                return formData;
            }
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
    function sRegistrarAntecedentePaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/registrar_antecedente_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sRegistrarHabitoPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/registrar_habito_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sSubirFoto(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/subir_foto_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function slistarEvolucion(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/listar_evolucion_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
  //
})();