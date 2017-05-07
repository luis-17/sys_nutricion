(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('CalendarController', CalendarController);

  /** @ngInject */
  function CalendarController() {

    var vm = this;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* event source that pulls from google.com */
    vm.eventSource = {
      url: 'http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic',
      className: 'gcal-event',           // an option!
      currentTimezone: 'America/Chicago' // an option!
    };

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

    /* alert on dayClick */
    vm.precision = 400;
    vm.lastClickTime = 0;
    vm.doubleClick = function(date){
      var time = new Date().getTime();
      if(time - vm.lastClickTime <= vm.precision){
        vm.events.push({
          title: 'New Event',
          start: date._d,
          className: ['b-l b-2x b-info']
        });
      }
      vm.lastClickTime = time;
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

    /* config object */
    vm.uiConfig = {
      calendar:{
        height: 450,
        contentHeight: 510,
        editable: true,
        header:{
          left: 'prev',
          center: 'title',
          right: 'next'
        },
        dayClick: vm.doubleClick,
        eventDrop: vm.alertOnDrop,
        eventResize: vm.alertOnResize,
        eventMouseover: vm.tooltipOnMouseOver
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
    vm.changeView = function(view) {
      angular.element('.calendar').fullCalendar('changeView', view);
    };

    vm.today = function() {
      angular.element('.calendar').fullCalendar('today');
    };

    /* event sources array*/
    vm.eventSources = [vm.events];

  }

})();
