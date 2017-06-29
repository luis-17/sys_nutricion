(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('UsuarioController', UsuarioController)
    .service('UsuarioServices', UsuarioServices);

  /** @ngInject */
  function UsuarioController($scope,UsuarioServices) {
    var vm = this;
  }
  function UsuarioServices($http, $q) {
    return({
        sListarUsuario: sListarUsuario,    
        sRegistrarUsuario: sRegistrarUsuario,
        sEditarUsuario: sEditarUsuario,
        sAnularUsuario: sAnularUsuario,
        sListaUsuarioAutocomplete: sListaUsuarioAutocomplete,            
    });
    function sListarUsuario(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Usuario/listar_usuario",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
    function sRegistrarUsuario(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Usuario/registrar_usuario",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sEditarUsuario(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Usuario/editar_usuario",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sAnularUsuario(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Usuario/anular_usuario",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sListaUsuarioAutocomplete(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Usuario/lista_usuario_autocomplete",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
})();