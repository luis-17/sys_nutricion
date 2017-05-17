(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('TipoClienteController', TipoClienteController)
    .service('TipoClienteServices', TipoClienteServices);

  /** @ngInject */
  function TipoClienteController($scope,TipoClienteServices) {
    var vm = this;
  }
  function TipoClienteServices($http, $q) {
    return({
        sListarTipoClienteCbo: sListarTipoClienteCbo
    });
    function sListarTipoClienteCbo(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "TipoCliente/listar_tipo_cliente_cbo",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
  }
})();
