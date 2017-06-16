(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('GrupoAlimentoController', GrupoAlimentoController)
    .service('GrupoAlimentoServices', GrupoAlimentoServices);

  /** @ngInject */
  function GrupoAlimentoController($scope,GrupoAlimentoServices) {
    var vm = this;
  }
  function GrupoAlimentoServices($http, $q) {
    return({
        sListarGrupoAlimento1: sListarGrupoAlimento1,
        sListarGrupoAlimento2: sListarGrupoAlimento2,        
    });
    function sListarGrupoAlimento1(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "grupoalimento/listar_grupo_alimento_1",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
    function sListarGrupoAlimento2(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "grupoalimento/listar_grupo_alimento_2",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }    
  }
})();