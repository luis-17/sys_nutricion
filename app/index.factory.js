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
  // function rootServices($http, $q) {
  //   return({
  //       sLogoutSessionCI: sLogoutSessionCI,
  //       sGetSessionCI: sGetSessionCI,
  //   });
  //   function sLogoutSessionCI(pDatos) {
  //     var datos = pDatos || {};
  //     var request = $http({
  //           method : "post",
  //           url :  angular.patchURLCI + "Acceso/logoutSessionCI",
  //           data : datos
  //     });
  //     return (request.then( handleSuccess,handleError ));
  //   }
  //   function sGetSessionCI(pDatos) {
  //     var datos = pDatos || {};
  //     var request = $http({
  //           method : "post",
  //           url :  angular.patchURLCI + "Acceso/getSessionCI",
  //           data : datos
  //     });
  //     return (request.then( handleSuccess,handleError ));
  //   }
  // }
})();
