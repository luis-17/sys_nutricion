(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('CitasController', CitasController)
    .service('CitasServices', CitasServices);

  /** @ngInject */
  function CitasController($scope,CitasServices,UbicacionServices,$uibModal) {
    var vm = this;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    vm.listarCitas = function(){
      CitasServices.sListarCita().then(function (rpta) {
        angular.forEach(rpta.datos, function(row, key) {
          row.start = new Date(row.start);
        });
        //vm.events = rpta.datos;  

        vm.events = [
          {title: 'All Day Event',start: new Date(y, m, 1), className: ['b-l b-2x b-greensea']},
          {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2), className: ['bg-dutch']},
          {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false, className: ['b-l b-2x b-primary']},
          {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false, className: ['b-l b-2x b-primary']},
          {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false, className: ['b-l b-2x b-default']},
          {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/', className: ['b-l b-2x b-hotpink']},
          {title: 'Make cupcakes', start: new Date(y, m, 2), className: ['b-l b-2x b-info'], location:'Bratislava', info:'The best in whole world.'},
          {title: 'Call wife', start: new Date(y, m, 6),end: new Date(y, m, 7), className: ['b-l b-2x b-red'], location:'Piestany', info:'And say her hello.'}
        ];

        vm.eventSources = [vm.events];
        console.log(vm.eventSources);
        //angular.element('.calendar').fullCalendar('refetchEvents');
      });
    };
    //vm.listarCitas();

    /*lista ubicaciones*/
    UbicacionServices.sListarUbicacionCbo().then(function(rpta){
      vm.listaUbicaciones = rpta.datos;
      console.log(vm.listaUbicaciones);
    })
    

    /* event source that contains custom events on the scope */
    vm.events = [
      {title: 'All Day Event',start: new Date(y, m, 1), className: ['b-l b-2x b-greensea']},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2), className: ['bg-dutch']},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false, className: ['b-l b-2x b-primary']},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false, className: ['b-l b-2x b-primary']},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false, className: ['b-l b-2x b-default']},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/', className: ['b-l b-2x b-hotpink']},
      {title: 'Make cupcakes', start: new Date(y, m, 2), className: ['b-l b-2x b-info'], location:'Bratislava', info:'The best in whole world.'},
      {title: 'Call wife', start: new Date(y, m, 6),end: new Date(y, m, 7), className: ['b-l b-2x b-red'], location:'Piestany', info:'And say her hello.'}
    ];
    vm.eventSources = [vm.events];

    /* alert on dayClick */
    vm.precision = 400;
    vm.lastClickTime = 0;

    /* alert on Drop */
    vm.alertOnDrop = function(event, delta){
      console.log('event', event);
      console.log('delta', delta);
    };

    /* alert on Resize */
    vm.alertOnResize = function(event, delta){
      vm.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    vm.overlay = angular.element('.fc-overlay');

    vm.tooltipOnMouseOver = function( event, jsEvent){
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

    vm.alertOnClick = function(event){
      console.log('event',event);
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
    vm.btnNuevaCita = function(start, item){
      console.log('btnNuevaCita');      
      console.log('start',start);  

      if(start){
        vm.events.push({
          title: 'New Event',
          start: start,
          className: ['bg-info']
        });
        vm.eventSources = [vm.events];
      }       

      vm.cita = {}; 
      var modalInstance = $uibModal.open({
        templateUrl:'app/pages/citas/cita_formView.html',
        controller: 'ModalInstanceController',
        controllerAs: 'modalcita',
        size: 'lg',
        backdropClass: 'splash splash-2 splash-ef-14',
        windowClass: 'splash splash-2 splash-ef-14',
        // animation: true,
        resolve: {
          items: function () {
            return vm.cita;
          },          
          listarCitas: function() {
            return vm.listarCitas;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        vm.selected = selectedItem;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
        // $log.info('Modal dismissed at: ' + new Date());
      });

      function ModalInstanceController($uibModalInstance,start,item) {
        var vm = this;
        vm.titleForm = 'CREAR NUEVA CITA';

        /*DATEPICKER*/
        vm.today = function() {
          vm.dt = new Date();
        };
        vm.today();

        vm.clear = function() {
          vm.dt = null;
        };

        vm.dateOptions = {
          dateDisabled: disabled,
          formatYear: 'yy',
          maxDate: new Date(2020, 5, 22),
          minDate: new Date(),
          startingDay: 1
        };

        vm.open = function() {
          vm.popup.opened = true;
        };

        vm.setDate = function(year, month, day) {
          vm.dt = new Date(year, month, day);
        };

        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        vm.format = vm.formats[0];
        vm.altInputFormats = ['M!/d!/yyyy'];

        vm.popup = {
          opened: false
        };


        /*TIMEPICKER*/
        vm.mytime = new Date();

        vm.hstep = 1;
        vm.mstep = 15;

        vm.options = {
          hstep: [1, 2, 3],
          mstep: [1, 5, 10, 15, 25, 30]
        };

        vm.ismeridian = true;
        vm.toggleMode = function() {
          vm.ismeridian = ! vm.ismeridian;
        };

        vm.update = function() {
          var d = new Date();
          d.setHours( 14 );
          d.setMinutes( 0 );
          vm.mytime = d;
        };

        vm.changed = function () {
          $log.log('Time changed to: ' + vm.mytime);
        };

        vm.clear = function() {
          vm.mytime = null;
        };

        vm.ok = function () {
          // $uibModalInstance.close(vm.selected.item);          
        };

        vm.cancel = function () {
          console.log('paso por aqui...');
          $uibModalInstance.close();
        };
      }
    }

    /* config object */
    vm.uiConfig = {
      calendar:{
        height: 450,
        contentHeight: 510,
        editable: true,
        dayNames: ["Domingo", "Lunes ", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
        dayNamesShort : ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        header:{
          left: 'prev',
          center: 'title',
          right: 'next',          
        },          
        dayClick: vm.btnNuevaCita,
        eventDrop: vm.alertOnDrop,
        eventResize: vm.alertOnResize,          
        //eventMouseover: vm.tooltipOnMouseOver,
        eventClick: vm.alertOnClick,
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
