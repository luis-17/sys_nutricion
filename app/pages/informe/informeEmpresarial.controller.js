(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('ProfesionalController', ProfesionalController)
    .service('ProfesionalServices', ProfesionalServices);

  /** @ngInject */
  function InformeEmpresarialController($scope,$uibModal,$timeout,$filter,filterFilter, uiGridConstants,$document, alertify,toastr,ProfesionalServices,
      EspecialidadServices,GrupoServices,UsuarioServices, pinesNotifications) {

    var vm = this;
    vm.selectedItem = {};
    vm.options = {};
    vm.fDemo = {};
    vm.fotoCrop = false;

    vm.remove = function(scope) {
      scope.remove();
    };

    vm.toggle = function(scope) {
      scope.toggle();
    };

    vm.expandAll = function() {
      vm.$broadcast('angular-ui-tree:expand-all');
    };

    paginationOptions.sortName = vm.gridOptions.columnDefs[0].name;
    vm.getPaginationServerSide = function() {
      vm.datosGrid = {
        paginate : paginationOptions
      };
      ProfesionalServices.sListarProfesional(vm.datosGrid).then(function (rpta) {
        vm.gridOptions.data = rpta.datos;
        vm.gridOptions.totalItems = rpta.paginate.totalRows;
        vm.mySelectionGrid = [];
      });
    }
    vm.getPaginationServerSide();
  }
  function ProfesionalServices($http, $q) {
    return({
        sListarProfesional: sListarProfesional,
        sListarProfesionalCbo: sListarProfesionalCbo
    });
    function sListarProfesional(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Profesional/listar_profesional",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }    
    function sListarProfesionalCbo(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Profesional/listar_profesional_cbo",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }             
  }
})();
