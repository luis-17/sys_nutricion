(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('EmpresaController', EmpresaController)
    .service('EmpresaServices', EmpresaServices);

  /** @ngInject */
  function EmpresaController($scope,$log,EmpresaServices) {

    var vm = this;
    vm.selectedItem = {};
    vm.options = {};


    vm.fDemo = {};
    // $log('asd');
    console.log('asd')
    EmpresaServices.sListarDemo().then(function (rpta) {
      vm.fDemo = rpta.datos;
      // $log(vm.fDemo,'vm.fDemo');
      console.log(vm.fDemo,'vm.fDemo');
    });

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
        sListarDemo: sListarDemo
    });
    function sListarDemo(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Empresa/obtener_fila_demo",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
  }
})();
