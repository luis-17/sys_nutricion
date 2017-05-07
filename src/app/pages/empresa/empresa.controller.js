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

    
    $scope.fDemo = {};
    EmpresaServices.sListarDemo().then(function (rpta) { 
      $scope.fDemo = rpta.datos; 
      console.log($scope.fDemo,'$scope.fDemo');
    }); 

    vm.remove = function(scope) {
      scope.remove();
    };

    vm.toggle = function(scope) {
      scope.toggle();
    };

    vm.expandAll = function($event) {
      $scope.$broadcast('angular-ui-tree:expand-all');
    };

  }
  function EmpresaServices($http, $q) {
    return({
        sListarDemo: sListarDemo
    });
/*    function sListarDemo(pDatos) { 
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Empresa/obtener_fila_demo", 
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }*/

    function sListarDemo(pDatos) { 
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Empresa/obtener_fila_demo", 
            data : datos,
            headers:{
              'User-Agent':       'Super Agent/0.0.1',
              'Content-Type':     'application/x-www-form-urlencoded'
            }               
      });
      return (request.then( handleSuccess,handleError ));
    }
  }
})();
