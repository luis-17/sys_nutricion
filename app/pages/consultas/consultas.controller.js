(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('ConsultasController', ConsultasController)
    .service('ConsultasServices', ConsultasServices);

  /** @ngInject */
  function ConsultasController ($scope,$uibModal,alertify,toastr,ConsultasServices) { 
    var vm = this;

    vm.fData = {};

    vm.isOpen = false;
    vm.titleToggle = "Ver Pliegues";
    vm.changeToggle = function(){
      if(vm.isOpen){
        vm.isOpen = false;
        vm.titleToggle = "Ver Pliegues";
      }else{
        vm.isOpen = true;
        vm.titleToggle = "Ocultar Pliegues";
      }
    }

    vm.pestania = 1;
    vm.chancePestania = function(value){
      vm.pestania = value;
    }

    vm.fData.si_embarazo = false;
    vm.changeEmbarazo = function(){
      if(vm.fData.si_embarazo){
        vm.fData.si_embarazo  = false;
      }else{
        vm.fData.si_embarazo  = true;
      }
    }

    vm.btnRegistrarConsulta = function(cita){
      var datos={
        cita:cita,
        consulta:vm.fData
      };

      ConsultasServices.sRegistrarConsulta(datos).then(function(rpta){
        console.log(rpta);
      });
    }

    vm.generarConsulta = function(row){      
      var modalInstance = $uibModal.open({
        templateUrl:'app/pages/Consultas/consulta_formView.html',        
        controllerAs: 'modalcon',
        size: 'xlg',
        backdropClass: 'splash splash-2 splash-ef-14',
        windowClass: 'splash splash-2 splash-ef-14',
        controller: function($scope, $uibModalInstance ){
          var vm = this;
          vm.fData = row;
          vm.modalTitle = 'Generar Consulta';                 

          vm.ok = function () {
            console.log('vm.fData', vm.fData);            
            CitasServices.sActualizarCita(vm.fData).then(function (rpta) {
              var openedToasts = [];
              vm.options = {
                timeout: '3000',
                extendedTimeout: '1000',
                preventDuplicates: false,
                preventOpenDuplicates: false
              };       
              if(rpta.flag == 1){ 
                angular.element('.calendar').fullCalendar( 'refetchEvents' );            
                $uibModalInstance.close();
                var title = 'OK';
                var iconClass = 'success';
              }else if( rpta.flag == 0 ){
                var title = 'Advertencia';
                var iconClass = 'warning';
              }else{
                alert('Ocurrió un error');
              }
              var toast = toastr[iconClass](rpta.message, title, vm.options);
              openedToasts.push(toast);
            });
          };
          vm.cancel = function () {
            $uibModalInstance.close();
          };
        }        
      });
    }    
  }
  function ConsultasServices($http, $q) {
    return({
        sRegistrarConsulta: sRegistrarConsulta,
        sAnularConsulta : sAnularConsulta ,
    });
    function sRegistrarConsulta(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Consulta/registrar_consulta",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sAnularConsulta(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Consulta/anular_consulta",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
})();
