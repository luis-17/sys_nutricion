(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('CitasController', CitasController)
    .service('CitasServices', CitasServices);

  /** @ngInject */
  function CitasController ($scope,$uibModal,$controller,alertify,toastr,CitasServices,UbicacionServices,PacienteServices, ConsultasServices) { 
    var vm = this;
    /* alert on Drop */
    vm.alertOnDrop = function(event, delta){
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
      angular.element('.calendar').fullCalendar( 'refetchEvents' );
    };
    //vm.overlay = angular.element('.fc-overlay');
    vm.menu = angular.element('.menu-dropdown');
    vm.alertOnClick =function(event, jsEvent, view) {
      vm.event = event;
      //console.log(jsEvent);
      vm.menu.addClass('open');
      vm.menu.removeClass('left right');
      var wrap = angular.element(jsEvent.target).closest('.fc-event');
      var cal = wrap.closest('.calendar');
      var left = wrap.offset().left - cal.offset().left;
      var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
      if( right > vm.menu.width() ) {
        vm.menu.addClass('left');        
      } else if ( left > vm.menu.width() ) {
        vm.menu.addClass('right');
      }

     /* console.log('cal.offset().bottom',cal.offset().bottom);
      console.log('cal.offset().top',cal.offset().top);
      console.log('vm.menu.height()',vm.menu.height());*/

      vm.event.posX = jsEvent.pageX - cal.offset().left;
      if(vm.event.posX < 140){
        vm.event.posX = 140;
      }

      vm.event.posY = jsEvent.pageY - cal.offset().top;
      if(vm.event.posY > 620){
        vm.event.posY = 620;
      }
    }

    vm.closeMenu = function(){
      vm.menu.removeClass('open');
    }

    vm.eventsF = function (start, end, timezone, callback) {
      var events = []; 
      CitasServices.sListarCita().then(function (rpta) {
        angular.forEach(rpta.datos, function(row, key) { 
            //row.start = new Date(row.start);
            row.start =  moment(row.start);
            row.end =  moment(row.end);
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
      angular.element('.calendar').fullCalendar('changeView', 'agendaWeek');
      angular.element('.calendar').fullCalendar('today');
    };
    vm.selectCell = function(date, end, jsEvent, view) {    
      var typeView = angular.element('.calendar').fullCalendar('getView');      
      if(typeView.type == 'month'){        
        angular.element('.calendar').fullCalendar( 'gotoDate', date );
        angular.element('.calendar').fullCalendar('changeView', 'agendaDay');
      }else{
        vm.btnCita(date, $scope.pacienteOrigen, end, $scope.consultaOrigen);
      }
    }

    /* add custom event*/
    vm.btnCita = function(start, paciente, end, consultaOrigen){
      var modalInstance = $uibModal.open({
        templateUrl:'app/pages/citas/cita_formView.html',        
        controllerAs: 'modalcita',
        size: 'lg',
        backdropClass: 'splash splash-ef-14',
        windowClass: 'splash splash-ef-14',
        controller: function($scope, $uibModalInstance){
          var vm = this;
          vm.fData = {};
          //vm.eventsF = arrToModal.eventsF;
          vm.modalTitle = 'Registro de Citas';

          if(paciente){
            vm.type='edit';
            vm.fData.cliente = paciente;
            console.log('vm.fData.paciente',vm.fData.cliente);
          }

          if(consultaOrigen){
            console.log('$scope.consultaOrigen', consultaOrigen);
          }

          /*lista ubicaciones*/
          UbicacionServices.sListarUbicacionCbo().then(function(rpta){
            vm.listaUbicaciones = rpta.datos;
            vm.listaUbicaciones.splice(0,0,{ id : '', descripcion:'--Seleccione un opción--'});
            vm.fData.ubicacion = vm.listaUbicaciones[0];
          });

          /*DATEPICKER*/
          vm.dp = {};
          vm.dp.today = function() {
            if(start){
              //console.log('start',start);
              vm.fData.fecha = start.toDate();
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
          vm.tp1.mstep = 30;
          vm.tp1.ismeridian = true;
          vm.tp1.toggleMode = function() {
            vm.tp1.ismeridian = ! vm.tp1.ismeridian;
          };

          vm.tp2 = angular.copy(vm.tp1);  
          if(start){            
            var partes_hora1 = start.format('hh:mm').split(':');
            //console.log('partes_hora1',partes_hora1);
            var d = new Date();
            d.setHours( parseInt(partes_hora1[0]) );
            d.setMinutes( parseInt(partes_hora1[1]) );
            vm.fData.hora_desde = d;

            if(end){
              var partes_hora2= end.format('hh:mm').split(':');
            }else{
              var partes_hora2= start.add(30, 'minutes').format('hh:mm').split(':');
            }

            //console.log('partes_hora2',partes_hora2);
            var c = new Date();
            c.setHours( parseInt(partes_hora2[0]) );
            c.setMinutes( parseInt(partes_hora2[1]) );
            vm.fData.hora_hasta = c;
          } else{
            vm.fData.hora_desde = new Date();
            vm.fData.hora_hasta = new Date();
          }  

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
            vm.fData.cliente = $item;
          }          

          vm.ok = function () {
            if(vm.fData.hora_desde){
              vm.fData.hora_desde_str = vm.fData.hora_desde.toLocaleTimeString();            
            }

            if(vm.fData.hora_hasta){
              vm.fData.hora_hasta_str = vm.fData.hora_hasta.toLocaleTimeString();            
            }

            if(consultaOrigen){
              vm.fData.consultaOrigen = consultaOrigen;
            }

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

          vm.callback = function(pacienteAgregado){
            vm.fData.cliente = pacienteAgregado;
            //console.log('vm.fData.cliente',vm.fData.cliente);
          }
        },
        
      });
    }

    vm.btnEditCita = function(row){
      var modalInstance = $uibModal.open({
        templateUrl:'app/pages/citas/cita_formView.html',        
        controllerAs: 'modalcita',
        size: 'lg',
        backdropClass: 'splash splash-ef-14',
        windowClass: 'splash splash-ef-14',
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

          vm.fData.fecha = vm.fData.start.toDate();

          /*TIMEPICKER*/
          vm.tp1 = {};
          vm.tp1.hstep = 1;
          vm.tp1.mstep = 15;
          vm.tp1.ismeridian = true;
          vm.tp1.toggleMode = function() {
            vm.tp1.ismeridian = ! vm.ismeridian;
          };
          vm.tp2 = angular.copy(vm.tp1); 

          var partes_hora1 = vm.fData.hora_desde_sql.split(':');
          //console.log(partes_hora1);
          var d = new Date();
          d.setHours( parseInt(partes_hora1[0]) );
          d.setMinutes( parseInt(partes_hora1[1]) );
          vm.fData.hora_desde = d;

          var partes_hora2= vm.fData.hora_hasta_sql.split(':');
          //console.log(partes_hora2);
          var c = new Date();
          c.setHours( parseInt(partes_hora2[0]) );
          c.setMinutes( parseInt(partes_hora2[1]) );
          vm.fData.hora_hasta = c;
          
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
            //console.log('vm.fData', vm.fData);  
            if(vm.fData.hora_desde){
              vm.fData.hora_desde_str = vm.fData.hora_desde.toLocaleTimeString();            
            }

            if(vm.fData.hora_hasta){
              vm.fData.hora_hasta_str = vm.fData.hora_hasta.toLocaleTimeString();            
            }          
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
      alertify.okBtn("Aceptar").cancelBtn("Cancelar").confirm('¿Realmente desea realizar la acción?', 
        function (ev) {
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
      });
    }

    $scope.changeViewConsulta(false);
    vm.tipoVista = '';
    vm.btnGenerarConsulta = function(row){      
      vm.tipoVista = 'new';
      $scope.changeViewConsulta(true);            
    }
    
    vm.btnEditarConsulta = function(row){      
      vm.tipoVista = 'edit';
      $scope.changeViewConsulta(true);           
    }

    vm.callback = function(){
      angular.element('.calendar').fullCalendar( 'refetchEvents' );
    }

    vm.btnAnularConsulta = function(row){
      alertify.okBtn("Aceptar").cancelBtn("Cancelar").confirm("¿Realmente desea realizar la acción?", function (ev) {
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
      });
    }

    vm.uiConfig = { 
      calendar:{
        allDaySlot: false,
        height: 450,
        contentHeight: 510,
        editable: true,
        selectable: true,
        defaultView: 'agendaWeek',
        dayNames: ["Domingo", "Lunes ", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
        dayNamesShort : ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        monthNames : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre","Diciembre"],
        monthNamesShort : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre","Diciembre"],
        header:{
          left: 'prev',
          center: 'title',
          right: 'next'
        },
        select: vm.selectCell,
        eventDrop: vm.alertOnDrop,
        eventResize: vm.alertOnResize,
        eventClick: vm.alertOnClick,
        minTime: '07:00:00',
        maxTime: '23:00:00',
        displayEventTime: false,
        views: {
          week: {
            titleFormat: 'D MMMM YYYY',
            titleRangeSeparator: ' - ',
          },
          day: {
            titleFormat: 'ddd DD-MM',
          }
        },
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
