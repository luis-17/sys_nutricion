(function() {
  'use strict';

  angular
    .module('minotaur')
    .factory('CalendarData', CalendarData);

  /** @ngInject */ 

  /* Esta factoria ya no la uso, no lo tomen en cuenta para el Calendar por ahora. */
  function CalendarData($http/*,rootServices*/) { 
         

    var interfazCalendarData = {};
    interfazCalendarData.getDataCalendarCitas = getDataCalendarCitas; 
    return interfazCalendarData; 

    function getDataCalendarCitas(arrParams) {
      return $http.post(arrParams.url, arrParams.datos).then(handleSuccess, handleError('Recurso no encontrado'));
    } 
  }
})();
