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
    vm.changePestania = function(value){
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

    vm.changeComposicion = function(value){
      if(value == 'peso'){
        if(vm.fData.porc_masa_grasa && vm.fData.porc_masa_grasa != null && vm.fData.porc_masa_grasa != ''){
          vm.fData.porc_masa_grasa = (100 - parseFloat(vm.fData.porc_masa_libre)).toFixed(2);
          vm.fData.kg_masa_grasa = ((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_grasa)) / 100).toFixed(2);
        }

        if(vm.fData.porc_masa_libre && vm.fData.porc_masa_libre != null && vm.fData.porc_masa_libre != ''){
          vm.fData.porc_masa_libre = (100 - parseFloat(vm.fData.porc_masa_grasa)).toFixed(2);
          vm.fData.kg_masa_libre = ((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_libre)) / 100).toFixed(2);
        }
      }else if(vm.fData.peso && vm.fData.peso != null && vm.fData.peso != ''){
        console.log(value);
        if(value == 'porc_masa_grasa'){
          vm.fData.porc_masa_libre = (100 - parseFloat(vm.fData.porc_masa_grasa)).toFixed(2);
          vm.fData.kg_masa_libre = ((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_libre)) / 100).toFixed(2);
          vm.fData.kg_masa_grasa = (parseFloat(vm.fData.peso) - parseFloat(vm.fData.kg_masa_libre)).toFixed(2);
        }

        if(value == 'porc_masa_libre'){
          vm.fData.porc_masa_grasa = (100 - parseFloat(vm.fData.porc_masa_libre)).toFixed(2);
          vm.fData.kg_masa_grasa = ((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_grasa)) / 100).toFixed(2);
          vm.fData.kg_masa_libre = (parseFloat(vm.fData.peso) - parseFloat(vm.fData.kg_masa_grasa)).toFixed(2);
        }        

        if(value == 'porc_masa_muscular'){
          vm.fData.kg_masa_muscular = ((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_muscular)) / 100).toFixed(2);
        }

        if(value == 'kg_masa_muscular'){
          vm.fData.porc_masa_grasa = ((parseFloat(vm.fData.kg_masa_muscular) * 100) / parseFloat(vm.fData.peso)).toFixed(2);
        }

        if(value == 'porc_agua_corporal'){
          vm.fData.kg_agua_corporal = ((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_agua_corporal)) / 100).toFixed(2);
        }

        if(value == 'kg_agua_corporal'){
          vm.fData.porc_agua_corporal = ((parseFloat(vm.fData.kg_agua_corporal) * 100) / parseFloat(vm.fData.peso)).toFixed(2);
        }
        
        if(value == 'porc_grasa_visceral'){
          vm.fData.kg_grasa_visceral = ((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_grasa_visceral)) / 100).toFixed(2);
        }

        if(value == 'kg_masa_muscular'){
          vm.fData.porc_grasa_visceral = ((parseFloat(vm.fData.kg_grasa_visceral) * 100) / parseFloat(vm.fData.peso)).toFixed(2);
        }
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
