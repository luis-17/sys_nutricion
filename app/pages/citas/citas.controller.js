(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('CitasController', CitasController)
    .service('CitasServices', CitasServices);

  /** @ngInject */
  function CitasController ($scope,$uibModal,alertify,toastr,CitasServices,UbicacionServices,PacienteServices) { 
    var vm = this;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    // vm.listarCitas = function(){
    //   CitasServices.sListarCita().then(function (rpta) {
    //     angular.forEach(rpta.datos, function(row, key) {
    //       row.start = new Date(row.start);
    //     });
    //     vm.events = rpta.datos;  
    //     vm.eventSources = [vm.events];
    //     console.log(vm.eventSources);
    //     //angular.element('.calendar').fullCalendar('refetchEvents');
    //   });
    // };
    // vm.listarCitas();
    
    /* event source that contains custom events on the scope */
    /*vm.events = [
      {title: 'All Day Event',start: new Date(y, m, 1), className: ['b-l b-2x b-greensea']},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2), className: ['bg-dutch']},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false, className: ['b-l b-2x b-primary']},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false, className: ['b-l b-2x b-primary']},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false, className: ['b-l b-2x b-default']},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/', className: ['b-l b-2x b-hotpink']},
      {title: 'Make cupcakes', start: new Date(y, m, 2), className: ['b-l b-2x b-info'], location:'Bratislava', info:'The best in whole world.'},
      {title: 'Call wife', start: new Date(y, m, 6),end: new Date(y, m, 7), className: ['b-l b-2x b-red'], location:'Piestany', info:'And say her hello.'}
    ];*/
    // vm.events = [
    //   {"id":"5","hora_desde_sql":"22:30:38","hora_hasta_sql":"11:00:38","hora_desde":1495405838,"hora_hasta":1495364438,"estado_ci":"1","fecha":"2017-05-17","cliente":{"idcliente":"2","cod_historia_clinica":"001","nombre":"JOHN","apellidos":"LENNON","sexo":"M"},"paciente":"JOHN LENNON","profesional":{"idprofesional":"1","profesional":"0"},"ubicacion":{"id":"1","descripcion":"UBICACION 1"},"atencion":{"idatencion":null,"fecha_atencion":null,"diagnostico_notas":null},"className":["b-l b-2x b-primary"],"start":"2017-05-17 22:30:38","title":"10:30 pm - 11:00 am","allDay":false},
    //   {"id":"6","hora_desde_sql":"04:12:30","hora_hasta_sql":"05:12:30","hora_desde":1495339950,"hora_hasta":1495343550,"estado_ci":"1","fecha":"2017-05-27","cliente":{"idcliente":"5","cod_historia_clinica":"H001","nombre":"RINGO","apellidos":"STARR","sexo":"M"},"paciente":"RINGO STARR","profesional":{"idprofesional":"1","profesional":"0"},"ubicacion":{"id":"1","descripcion":"UBICACION 1"},"atencion":{"idatencion":null,"fecha_atencion":null,"diagnostico_notas":null},"className":["b-l b-2x b-primary"],"start":"2017-05-27 04:12:30","title":"04:12 am - 05:12 am","allDay":false},
    //   {"id":"4","hora_desde_sql":"20:20:18","hora_hasta_sql":"20:50:18","hora_desde":1495398018,"hora_hasta":1495399818,"estado_ci":"1","fecha":"2017-05-18","cliente":{"idcliente":"3","cod_historia_clinica":"002","nombre":"PAUL","apellidos":"MCCARTNEY","sexo":"M"},"paciente":"PAUL MCCARTNEY","profesional":{"idprofesional":"1","profesional":"0"},"ubicacion":{"id":"2","descripcion":"UBICACION 2"},"atencion":{"idatencion":null,"fecha_atencion":null,"diagnostico_notas":null},"className":["b-l b-2x b-primary"],"start":"2017-05-18 20:20:18","title":"08:20 pm - 08:50 pm","allDay":false},
    //   {"id":"3","hora_desde_sql":"20:20:18","hora_hasta_sql":"20:50:18","hora_desde":1495398018,"hora_hasta":1495399818,"estado_ci":"1","fecha":"2017-05-17","cliente":{"idcliente":"3","cod_historia_clinica":"002","nombre":"PAUL","apellidos":"MCCARTNEY","sexo":"M"},"paciente":"PAUL MCCARTNEY","profesional":{"idprofesional":"1","profesional":"0"},"ubicacion":{"id":"3","descripcion":"UBICACION 3"},"atencion":{"idatencion":null,"fecha_atencion":null,"diagnostico_notas":null},"className":["b-l b-2x b-primary"],"start":"2017-05-17 20:20:18","title":"08:20 pm - 08:50 pm","allDay":false}
    // ];
    // vm.eventSources = [vm.events];

    /* alert on Drop */
    vm.alertOnDrop = function(event, delta){
      console.log('event', event);
      console.log('delta', delta);
      vm.dropdown.removeClass('open');
      var datos = {
        event: event,
        delta: delta,
      };

      CitasServices.sDropCita(datos).then(function(rpta){
        console.log(rpta);
      });
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
      }/**/
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
    vm.selectCell = function(start, end) {
      console.log(start, end,'select cell');
    }
    vm.eventSources = [vm.eventsF]; 

    vm.dropdown = angular.element('.my-dropdown');
    vm.alertOnClick = function(event, jsEvent){
      vm.dropdown.addClass('open');
      vm.event = event;
      vm.dropdown.removeClass('left ');
      var wrap = angular.element(jsEvent.target).closest('.fc-event');
      var cal = wrap.closest('.calendar');
      var left = wrap.offset().left - cal.offset().left;
      var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
      if( right > vm.dropdown.width() ) {
        vm.dropdown.addClass('left');
      } else if ( left > vm.dropdown.width() ) {
        vm.dropdown.addClass('right');
      }
      if (wrap.find('.my-dropdown').length === 0) {
        wrap.append( vm.dropdown );
      }
    }

    /* Change View */
    vm.changeView = function(view,calendar) {
      angular.element('.calendar').fullCalendar('changeView', view);
    };

    vm.today = function() {
      angular.element('.calendar').fullCalendar('changeView', 'agendaDay');
      angular.element('.calendar').fullCalendar('today');
    };

    /* add custom event*/
    vm.btnCita = function(start, type){
      vm.dropdown.removeClass('open');
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
                $uibModalInstance.close(vm.fData);
              }
            });

          };
          vm.cancel = function () {
            $uibModalInstance.close();
          };
        },
        resolve: {
          arrToModal: function() {
            return {
              listarCitas : vm.listarCitas,
            }
          }
        }
      });
    }

    vm.btnEditCita = function(){
      vm.dropdown.removeClass('open');
      var modalInstance = $uibModal.open({
        templateUrl:'app/pages/citas/cita_formView.html',        
        controllerAs: 'modalcita',
        size: 'lg',
        backdropClass: 'splash splash-2 splash-ef-14',
        windowClass: 'splash splash-2 splash-ef-14',
        controller: function($scope, $uibModalInstance, arrToModal ){
          var vm = this;
          vm.fData = arrToModal.event;
          vm.listarCitas = arrToModal.listarCitas;
          vm.modalTitle = 'Modificacion de Citas';
          vm.type = 'edit';

          /*lista ubicaciones*/
          UbicacionServices.sListarUbicacionCbo().then(function(rpta){
            vm.listaUbicaciones = rpta.datos;
            vm.listaUbicaciones.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
            angular.forEach(vm.listaUbicaciones, function(value, key) {
              if(value.id == vm.fData.ubicacion.id){
                vm.fData.ubicacion = vm.listaUbicaciones[key];
              }
            });            
          });

          /*DATEPICKER*/
          vm.dp = {};
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

          vm.fData.fecha = new Date(vm.fData.fecha);

          /*TIMEPICKER*/
          vm.tp1 = {};
          vm.tp1.hstep = 1;
          vm.tp1.mstep = 15;
          vm.tp1.ismeridian = true;
          vm.tp1.toggleMode = function() {
            vm.tp1.ismeridian = ! vm.ismeridian;
          };
          vm.tp2 = angular.copy(vm.tp1); 

          vm.fData.hora_desde =  new Date(vm.fData.hora_desde);        
          vm.fData.hora_hasta =  new Date(vm.fData.hora_hasta);       

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
            console.log('vm.fData', vm.fData);            
            CitasServices.sActualizarCita(vm.fData).then(function (rpta) {
              console.log('llego aqui...');
              if(rpta.flag == 1){
                vm.listarCitas();
                $uibModalInstance.close(vm.fData);
              }
            });
          };
          vm.cancel = function () {
            $uibModalInstance.close();
          };
        },
        resolve: {
          arrToModal: function() {
            return {
              listarCitas : vm.listarCitas,
              event : vm.event,
            }
          }
        }
      });
    }

    vm.btnAnular = function(event){
      alertify.confirm("¿Realmente desea realizar la acción?", function (ev) {
        ev.preventDefault();
        console.log('anular...');
      }, function(ev) {
          ev.preventDefault();
      });
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
        sDropCita: sDropCita,
        sActualizarCita: sActualizarCita,
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

    function sDropCita(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Cita/drop_cita",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }    

    function sActualizarCita(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Cita/actualizar_cita",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
})();
