(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('EmpresaController', EmpresaController)
    .service('EmpresaServices', EmpresaServices);

  /** @ngInject */
  function EmpresaController($scope,EmpresaServices) {

    var vm = this;
    vm.selectedItem = {};
    vm.options = {};
    vm.fDemo = {};

    vm.remove = function(scope) {
      scope.remove();
    };

    vm.toggle = function(scope) {
      scope.toggle();
    };

    vm.expandAll = function() {
      vm.$broadcast('angular-ui-tree:expand-all');
    };

  }
  function EmpresaServices($http, $q) {
    return({
        sListarEmpresaCbo: sListarEmpresaCbo,
    });
    function sListarEmpresaCbo(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Empresa/listar_empresa_cbo",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
  }
})();
