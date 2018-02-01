(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController($scope,$uibModal,$timeout,$filter, pinesNotifications, pageLoading, CitasServices, InformeGeneralServices) {
    var vm = this;
    vm.fData = {};
    vm.listaProxCitas = [];  
    vm.listarProxCitas = function() { 
      CitasServices.sListarProximasCitas().then(function(rpta) {
        if( rpta.flag == 1 ){
          vm.listaProxCitas = rpta.datos; 
        }else{
          vm.listaProxCitas = [];  
        }
      });
    }
    vm.listarInformeGeneral = function() { 
      InformeGeneralServices.sListarInformeGeneral().then(function(rpta) {
        if( rpta.flag == 1 ){ 
          vm.fData.cantPacAtendidos = rpta.datos.pac_atendidos.cantidad;
          vm.fData.cantAteRealizadas = rpta.datos.atenciones_realizadas.cantidad;
        }else{
          vm.fData = {};
        }
      });
    }
    $timeout(function() { 
      if( $scope.fSessionCI.idusuario ){ 
        vm.listarProxCitas(); 
        vm.listarInformeGeneral();
      }
    },1000);
    
  }
})();
