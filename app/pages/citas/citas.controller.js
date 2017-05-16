angular.module('minotaur')
  .controller('CitasController', ['$scope', '$sce', '$filter', '$uibModal', '$window', '$http', '$log', '$timeout', 'CitasServices',
    function($scope, $sce, $filter,  $uibModal, $window, $http, $log, $timeout, 
      CitasServices,
    ) {
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
          angular.element('.calendar').fullCalendar('refetchEvents');
        });
      };
      //vm.listarCitas();
      

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
      vm.click = function(start){
        var time = new Date().getTime();
        console.log('start',start);      
        vm.events.push({
          title: 'New Event',
          start: start,
          className: ['b-l b-2x b-info']
        });
        vm.eventSources = [vm.events];        
      };

      /* alert on Drop */
      vm.alertOnDrop = function(event, delta){
        vm.alertMessage = ('Event Droped to make dayDelta ' + delta);
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
          dayClick: vm.click,
          eventDrop: vm.alertOnDrop,
          eventResize: vm.alertOnResize,          
          //eventMouseover: vm.tooltipOnMouseOver,
          eventClick: vm.alertOnClick,
        }
      };    

      /* add custom event*/
      vm.addEvent = function() {
        vm.events.push({
          title: 'New Event',
          start: new Date(y, m, d),
          className: ['b-l b-2x b-info']
        });
      };

      /* remove event */
      vm.remove = function(index) {
        vm.events.splice(index,1);
      };

      /* Change View */
      vm.changeView = function(view,calendar) {
        /*console.log('entro aquii...');*/
        angular.element('.calendar').fullCalendar('changeView', view);
      };

      vm.today = function() {
        /*console.log('entro aquii...');*/
        angular.element('.calendar').fullCalendar('changeView', 'agendaDay');
        angular.element('.calendar').fullCalendar('today');
      };      

      vm.btnNuevaCita = function(){
        console.log('btnNuevaCita');
      }

  }])
  .service("CitasServices",function($http, $q) {
    return({
        sListarCita: sListarCita,
        sRegistrar: sRegistrar,

    });

    function sListarCita(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Cita/listar_citas",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
      // return (request.then(function(response){
      //   return( response.data );

      // }));
    }

    function sRegistrar(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Paciente/registrar",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }

  });
