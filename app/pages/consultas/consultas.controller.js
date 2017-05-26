(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('ConsultasController', ConsultasController)
    .service('ConsultasServices', ConsultasServices);

  /** @ngInject */
  function ConsultasController ($scope,$uibModal,alertify,toastr,ConsultasServices) { 
    var vm = this; 

    vm.initConsulta = function(cita,origen,callback,tipoVista){
      vm.cita = cita;
      vm.origen = origen;
      vm.callback = callback;
      vm.tipoVista = tipoVista;
      console.log('vm.cita',vm.cita);

      
      if(vm.tipoVista == 'new'){
        vm.fData = {};
        vm.fData.si_embarazo = false;
        vm.dp.today();
      }else if(vm.tipoVista == 'edit'){
        ConsultasServices.sCargarConsulta(vm.cita).then(function(rpta){
          vm.fData = rpta.datos;
          vm.fData.fecha_atencion = new Date(vm.fData.fecha_atencion);
          console.log(rpta);
        });        
      }
    }

    /*DATEPICKER*/
    vm.dp = {};
    vm.dp.today = function() {
      vm.fData.fecha_atencion = new Date();
    };      
    
    vm.dp.clear = function() {
      vm.fData.fecha_atencion = null;
    };

    vm.dp.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      startingDay: 1,
      placement:'bottom'
    };

    vm.dp.open = function() {
      vm.dp.popup.opened = true;
    };

    vm.dp.formats = ['dd/MM/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.dp.format = vm.dp.formats[0];
    vm.dp.altInputFormats = ['M!/d!/yyyy'];

    vm.dp.popup = {
      opened: false
    }; 

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
        //console.log(value);
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
          vm.fData.porc_masa_muscular = ((parseFloat(vm.fData.kg_masa_muscular) * 100) / parseFloat(vm.fData.peso)).toFixed(2);
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

        if(value == 'kg_grasa_visceral'){
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
        var openedToasts = [];
        vm.options = {
          timeout: '3000',
          extendedTimeout: '1000',
          preventDuplicates: false,
          preventOpenDuplicates: false
        };       
        if(rpta.flag == 1){                    
          var title = 'OK';
          var iconClass = 'success';
          $scope.changeViewConsulta(false);
          vm.callback();
        }else if( rpta.flag == 0 ){
          var title = 'Advertencia';
          var iconClass = 'warning';
        }else{
          alert('Ocurrió un error');
        }
        var toast = toastr[iconClass](rpta.message, title, vm.options);
        openedToasts.push(toast);
      });
    }


  }
  function ConsultasServices($http, $q) {
    return({
        sRegistrarConsulta: sRegistrarConsulta,
        sAnularConsulta : sAnularConsulta,
        sCargarConsulta: sCargarConsulta,
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
    function sCargarConsulta(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Consulta/cargar_consulta",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
})();
