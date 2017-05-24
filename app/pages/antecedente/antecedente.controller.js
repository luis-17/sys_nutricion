(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('AntecedenteController', AntecedenteController)
    .service('AntecedenteServices', AntecedenteServices);

  /** @ngInject */
  function AntecedenteController($scope,AntecedenteServices) {
    var vm = this;
  }
  function AntecedenteServices($http, $q) {
    return({
        sListarAntecedentePorTipo: sListarAntecedentePorTipo
    });
    function sListarAntecedentePorTipo(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Antecedente/listar_antecedente_por_tipo",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
  }
})();
