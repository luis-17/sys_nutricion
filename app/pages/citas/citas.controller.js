(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('CitasController', CitasController)
    .service('CitasServices', CitasServices);

  /** @ngInject */
  function CitasController ($scope,$uibModal,alertify,toastr,CitasServices,UbicacionServices,PacienteServices, ConsultasServices) { 
    var vm = this;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* alert on Drop */
    vm.alertOnDrop = function(event, delta){
      console.log('event', event);
      console.log('delta', delta);
      //vm.dropdown.removeClass('open');
      var datos = {
        event: event,
        delta: delta,
      };

      CitasServices.sDropCita(datos).then(function(rpta){        
        angular.element('.calendar').fullCalendar( 'refetchEvents' );
        var openedToasts = [];
        vm.options = {
          timeout: '3000',
          extendedTimeout: '1000',
          preventDuplicates: false,
          preventOpenDuplicates: false
        };       
        if(rpta.flag == 1){ 
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
    /* alert on Resize */
    vm.alertOnResize = function(event, delta){ 
      console.log('resize mee');
      vm.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    vm.overlay = angular.element('.fc-overlay');
    //vm.tooltipOnMouseOver = function( event, jsEvent){
    vm.alertOnClick = function( event, jsEvent){
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
      /*var arrParams = { 
        url: angular.patchURLCI+"Cita/listar_citas", 
        datos:{ 
          //'events': vm.events
        }
      }*/
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
    vm.btnCita = function(start, type){
      //vm.dropdown.removeClass('open');     
      console.log('start',start);  

      var modalInstance = $uibModal.open({
        templateUrl:'app/pages/citas/cita_formView.html',        
        controllerAs: 'modalcita',
        size: 'lg',
        backdropClass: 'splash splash-2 splash-ef-14',
        windowClass: 'splash splash-2 splash-ef-14',
        controller: function($scope, $uibModalInstance){
          var vm = this;
          vm.fData = {};
          //vm.eventsF = arrToModal.eventsF;
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
              console.log(start);
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
              var openedToasts = [];
              vm.options = {
                timeout: '3000',
                extendedTimeout: '1000',
                preventDuplicates: false,
                preventOpenDuplicates: false
              };       
              if(rpta.flag == 1){ 
                $uibModalInstance.close(vm.fData);
                angular.element('.calendar').fullCalendar( 'refetchEvents' );            
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
            $uibModalInstance.close();
          };
        },
        
      });
    }

    vm.btnEditCita = function(row){
      //vm.dropdown.removeClass('open');
      var modalInstance = $uibModal.open({
        templateUrl:'app/pages/citas/cita_formView.html',        
        controllerAs: 'modalcita',
        size: 'lg',
        backdropClass: 'splash splash-2 splash-ef-14',
        windowClass: 'splash splash-2 splash-ef-14',
        controller: function($scope, $uibModalInstance ){
          var vm = this;
          vm.fData = row;
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
              var openedToasts = [];
              vm.options = {
                timeout: '3000',
                extendedTimeout: '1000',
                preventDuplicates: false,
                preventOpenDuplicates: false
              };       
              if(rpta.flag == 1){ 
                angular.element('.calendar').fullCalendar( 'refetchEvents' );            
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
            $uibModalInstance.close();
          };
        }        
      });
    }

    vm.btnAnular = function(row){
      //vm.dropdown.removeClass('open');
      alertify.confirm("¿Realmente desea realizar la acción?", function (ev) {
        ev.preventDefault();        
        CitasServices.sAnularCita(row).then(function (rpta) {              
          var openedToasts = [];
          vm.options = {
            timeout: '3000',
            extendedTimeout: '1000',
            preventDuplicates: false,
            preventOpenDuplicates: false
          };       
          if(rpta.flag == 1){
            angular.element('.calendar').fullCalendar( 'refetchEvents' ); 
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

    vm.viewCita = true;
    vm.viewConsulta = false;
    vm.btnGenerarConsulta = function(row){
      //console.log('btnGenerarConsulta', row);      
      vm.viewConsulta = true;
      //console.log('vm.viewConsulta', vm.viewConsulta);
    }

    vm.btnAnularConsulta = function(row){
      console.log('btnAnularConsulta', row);
      alertify.confirm("¿Realmente desea realizar la acción?", function (ev) {
        ev.preventDefault();        
        ConsultasServices.sAnularConsulta(row).then(function (rpta) {              
          var openedToasts = [];
          vm.options = {
            timeout: '3000',
            extendedTimeout: '1000',
            preventDuplicates: false,
            preventOpenDuplicates: false
          };       
          if(rpta.flag == 1){
            angular.element('.calendar').fullCalendar( 'refetchEvents' ); 
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

    vm.uiConfig = { 
      calendar:{
        height: 450,
        contentHeight: 510,
        editable: true,
        selectable: true,
        defaultView: 'agendaWeek',
        dayNames: ["Domingo", "Lunes ", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
        dayNamesShort : ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        monthNames : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre","Diciembre"],
        monthNamesShort : ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        header:{
          left: 'prev',
          center: 'title',
          right: 'next'
        },
        select: vm.btnCita,
        eventDrop: vm.alertOnDrop,
        eventResize: vm.alertOnResize,
        //eventMouseover: vm.tooltipOnMouseOver,
        eventClick: vm.alertOnClick
      }
    };
    //console.log(vm.uiConfig.calendar);
  }
  function CitasServices($http, $q) {
    return({
        sListarCita: sListarCita,
        sRegistrarCita: sRegistrarCita,
        sDropCita: sDropCita,
        sActualizarCita: sActualizarCita,
        sAnularCita:sAnularCita,
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
    function sAnularCita(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Cita/anular_cita",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
})();
