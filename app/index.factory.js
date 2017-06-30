(function() {
  'use strict';

  angular
    .module('minotaur')
    .factory('CalendarData', CalendarData)
    .factory('ModalReporteFactory', ModalReporteFactory);

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
  function ModalReporteFactory($uibModal,$http,$q,rootServices){
    var interfazReporte = {
      getPopupReporte: function(arrParams){ //console.log(arrParams.datos.salida,' as');
        if( arrParams.datos.salida == 'pdf' || angular.isUndefined(arrParams.datos.salida) ){
          $uibModal.open({
            templateUrl: 'app/pages/reportes/popup_reporte.php',
            controllerAs: 'mr',
            size: 'lg',
            controller: function ($scope,$uibModalInstance,arrParams) {
              $scope.titleModalReporte = arrParams.titulo;
              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              }
              var deferred = $q.defer();
              $http.post(arrParams.url, arrParams.datos).then(
                function(res) {
                    // console.log('succes !', res.data);
                    $('#frameReporte').attr("src", res.data.urlTempPDF);

                    deferred.resolve(res.data);
                },
                function(err) {
                    // console.log('error...', err);
                    deferred.resolve(err);
                }
              );
            },
            resolve: {
              arrParams: function() {
                return arrParams;
              }
            }
          });
        }
      }

    }
    return interfazReporte;
  }
})();
