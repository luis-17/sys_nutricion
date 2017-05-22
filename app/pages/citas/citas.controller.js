(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('CitasController', CitasController)
    .service('CitasServices', CitasServices);

  /** @ngInject */
  function CitasController($scope,$http,$uibModal,CitasServices,UbicacionServices,PacienteServices) {
    var vm = this;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    

    /* alert on Drop */
    vm.alertOnDrop = function(event, delta){
      console.log('event', event);
      console.log('delta', delta);
    };

    /* alert on Resize */
    vm.alertOnResize = function(event, delta){ 
      console.log('resize mee');
      vm.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    vm.overlay = angular.element('.fc-overlay');

    vm.tooltipOnMouseOver = function( event, jsEvent){ 
      console.log('hover me');
      vm.event = event;
      vm.overlay.removeClass('left right');
      var wrap = angular.element(jsEvent.target).closest('.fc-event');
      var cal = wrap.closest('.calendar');
      var left = wrap.offset().left - cal.offset().left;
      var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
      if( right > vm.overlay.width() ) {
        vm.overlay.addClass('left');
      } else if ( left > vm.overlay.width() ) {
        vm.overlay.addClass('right');
      }
      if (wrap.find('.fc-overlay').length === 0) {
        wrap.append( vm.overlay );
      }
    };
    vm.selectCell = function(start, end) {
      console.log(start, end,'select cell');
    }
    vm.alertOnClick = function(event){ 
      console.log('click me',event);
      vm.event = event;
    }

    vm.eventsF = function (start, end, timezone, callback) {
      var arrParams = { 
        url: angular.patchURLCI+"Cita/listar_citas", 
        datos:{ 
          //'events': vm.events
        }
      }
      var events = []; 
      CitasServices.sListarCita().then(function (rpta) {
        angular.forEach(rpta.datos, function(row, key) { 
            row.start = new Date(row.start);
        });
        events = rpta.datos; 
        callback(events); 
      });
    } 
    vm.eventSources = [vm.eventsF]; 

    /* Change View */
    vm.changeView = function(view,calendar) {
      angular.element('.calendar').fullCalendar('changeView', view);
    };

    vm.today = function() {
      angular.element('.calendar').fullCalendar('changeView', 'agendaDay');
      angular.element('.calendar').fullCalendar('today');
    };

    /* add custom event*/
    vm.btnCita = function(start, type, item){
      console.log('btnCita');      
      console.log('start',start);  

      if(start){
        vm.events.push({
          title: 'New Event',
          start: start,
          className: ['bg-info']
        });
        vm.eventSources = [vm.events];
      }   

      var modalInstance = $uibModal.open({
        templateUrl:'app/pages/citas/cita_formView.html',        
        controllerAs: 'modalcita',
        size: 'lg',
        backdropClass: 'splash splash-2 splash-ef-14',
        windowClass: 'splash splash-2 splash-ef-14',
        // controller: 'ModalInstanceController',
        controller: function($scope, $uibModalInstance, arrToModal ){
          var vm = this;
          vm.fData = {};
          vm.listarCitas = arrToModal.listarCitas;
          vm.modalTitle = 'Registro de Citas';

          /*lista ubicaciones*/
          UbicacionServices.sListarUbicacionCbo().then(function(rpta){
            vm.listaUbicaciones = rpta.datos;
            vm.listaUbicaciones.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
            vm.fData.ubicacion = vm.listaUbicaciones[0];
            console.log(vm.listaUbicaciones);
          });

          /*DATEPICKER*/
          vm.dp = {};
          vm.dp.today = function() {
            if(start){
              vm.fData.fecha = start;
            }else{
              vm.fData.fecha = new Date();
            }
          };
          vm.dp.today();

          vm.dp.clear = function() {
            vm.fData.fecha = null;
          };

          vm.dp.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
          };

          vm.dp.open = function() {
            vm.dp.popup.opened = true;
          };

          vm.dp.formats = ['dd-MM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          vm.dp.format = vm.dp.formats[0];
          vm.dp.altInputFormats = ['M!/d!/yyyy'];

          vm.dp.popup = {
            opened: false
          }; 

          /*TIMEPICKER*/
          vm.tp1 = {};
          vm.tp1.hstep = 1;
          vm.tp1.mstep = 15;
          vm.tp1.ismeridian = true;
          vm.tp1.toggleMode = function() {
            vm.tp1.ismeridian = ! vm.ismeridian;
          };

          vm.tp2 = angular.copy(vm.tp1);          
          vm.fData.hora_desde = new Date();
          vm.fData.hora_hasta = new Date();

          vm.getPacienteAutocomplete = function (value) {
            var params = {};
            params.search= value;
            params.sensor= false;
              
            return PacienteServices.sListaPacientesAutocomplete(params).then(function(rpta) { 
              vm.noResultsLM = false;
              if( rpta.flag === 0 ){
                vm.noResultsLM = true;
              }
              return rpta.datos; 
            });
          }

          vm.getSelectedPaciente = function($item, $model, $label){
            vm.fData.paciente = $item;
          }          

          vm.ok = function () {
            console.log('fdata', vm.fData);            
            CitasServices.sRegistrarCita(vm.fData).then(function (rpta) {
              if(rpta.flag == 1){
                vm.listarCitas();
                //$uibModalInstance.close(vm.fData);
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
              listarCitas : vm.listarCitas,
              // listaSexos : $scope.listaSexos,
              // gridComboOptions : $scope.gridComboOptions,
              // mySelectionComboGrid : $scope.mySelectionComboGrid
            }
          }
        }
      });
      /*modalInstance.result.then(function (selectedItem) {
        vm.selected = selectedItem;
        console.log(selectedItem);
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
        // $log.info('Modal dismissed at: ' + new Date());
      });*/
    }
    vm.uiConfig = { 
      calendar:{
        height: 450,
        contentHeight: 510,
        editable: true,
        selectable: true,
        defaultView: 'agendaWeek',
        dayNames: ["Domingo", "Lunes ", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
        dayNamesShort : ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        header:{
          left: 'prev',
          center: 'title',
          right: 'next'
        },
        select: vm.selectCell,
        // dayClick: vm.doubleClick,
        eventDrop: vm.alertOnDrop,
        eventResize: vm.alertOnResize,
        eventMouseover: vm.tooltipOnMouseOver,
        eventClick: vm.alertOnClick
      }
    };
    
  }
  function CitasServices($http, $q) {
    return({
        sListarCita: sListarCita,
        sRegistrarCita: sRegistrarCita,
    });
    function sListarCita(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Cita/listar_citas",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }

    function sRegistrarCita(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Cita/registrar_cita",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
})();
