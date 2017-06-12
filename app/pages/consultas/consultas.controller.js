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
      //console.log('vm.cita',vm.cita);

      if($scope.pestaniaConsulta){
        vm.changePestania($scope.pestaniaConsulta);
      }else{
        vm.changePestania(1);
      }
      
      if(vm.tipoVista == 'new'){
        vm.fData = {};
        vm.fData.si_embarazo = false;
        vm.fData.fecha_atencion = moment(vm.cita.fecha).toDate();
        //console.log('vm.fData.fecha_atencion',vm.fData.fecha_atencion);
      }else if(vm.tipoVista == 'edit'){
        ConsultasServices.sCargarConsulta(vm.cita).then(function(rpta){
          vm.fData = rpta.datos;
          vm.fData.fecha_atencion = moment(vm.fData.fecha_atencion).toDate();
          vm.fData.kg_masa_grasa = parseFloat(((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_grasa)) / 100).toFixed(2));
          vm.fData.kg_masa_libre = parseFloat(((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_libre)) / 100).toFixed(2));
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
          vm.fData.porc_masa_grasa = parseFloat((100 - parseFloat(vm.fData.porc_masa_libre)).toFixed(2));
          vm.fData.kg_masa_grasa = parseFloat(((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_grasa)) / 100).toFixed(2));
        }

        if(vm.fData.porc_masa_libre && vm.fData.porc_masa_libre != null && vm.fData.porc_masa_libre != ''){
          vm.fData.porc_masa_libre = parseFloat((100 - parseFloat(vm.fData.porc_masa_grasa)).toFixed(2));
          vm.fData.kg_masa_libre = parseFloat(((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_libre)) / 100).toFixed(2));
        }
      }else if(vm.fData.peso && vm.fData.peso != null && vm.fData.peso != ''){
        //console.log(value);
        if(value == 'porc_masa_grasa'){
          vm.fData.porc_masa_libre = parseFloat((100 - parseFloat(vm.fData.porc_masa_grasa)).toFixed(2));
          vm.fData.kg_masa_libre = parseFloat(((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_libre)) / 100).toFixed(2));
          vm.fData.kg_masa_grasa = parseFloat((parseFloat(vm.fData.peso) - parseFloat(vm.fData.kg_masa_libre)).toFixed(2));
        }

        if(value == 'porc_masa_libre'){
          vm.fData.porc_masa_grasa = parseFloat((100 - parseFloat(vm.fData.porc_masa_libre)).toFixed(2));
          vm.fData.kg_masa_grasa = parseFloat(((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_grasa)) / 100).toFixed(2));
          vm.fData.kg_masa_libre = parseFloat((parseFloat(vm.fData.peso) - parseFloat(vm.fData.kg_masa_grasa)).toFixed(2));
        }

        if(value == 'porc_masa_muscular'){
          vm.fData.kg_masa_muscular = parseFloat(((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_muscular)) / 100).toFixed(2));
        }

        if(value == 'kg_masa_muscular'){
          vm.fData.porc_masa_muscular = parseFloat(((parseFloat(vm.fData.kg_masa_muscular) * 100) / parseFloat(vm.fData.peso)).toFixed(2));
        }

        if(value == 'porc_agua_corporal'){
          vm.fData.kg_agua_corporal = parseFloat(((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_agua_corporal)) / 100).toFixed(2));
        }

        if(value == 'kg_agua_corporal'){
          vm.fData.porc_agua_corporal = parseFloat(((parseFloat(vm.fData.kg_agua_corporal) * 100) / parseFloat(vm.fData.peso)).toFixed(2));
        }

        if(value == 'porc_grasa_visceral'){
          vm.fData.kg_grasa_visceral = parseFloat(((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_grasa_visceral)) / 100).toFixed(2));
        }

        if(value == 'kg_grasa_visceral'){
          vm.fData.porc_grasa_visceral = parseFloat(((parseFloat(vm.fData.kg_grasa_visceral) * 100) / parseFloat(vm.fData.peso)).toFixed(2));
        }
      }
    }

    vm.calcularIndicadores = function(){
      //redondear peso
      vm.fData.peso = parseFloat((vm.fData.peso * 1).toFixed(2));
      //IMC peso / (estatura en mtr al cuadrado)
      vm.fData.imc = (vm.fData.peso / ((vm.cita.cliente.estatura/100) * (vm.cita.cliente.estatura/100))).toFixed(2);

      //Peso Ideal = 0,75 (altura en cm – 150) + 50
      vm.fData.pesoIdeal = ((0.75 * (vm.cita.cliente.estatura - 150)) + 50).toFixed(2);

      if(vm.cita.cliente.sexo == 'M'){
        //Hombres TMB = (10 x peso en kg) + (6,25 × altura en cm) – (5 × edad en años) + 5
        vm.fData.metabolismo = ((10 * vm.fData.peso) + (6.25 * vm.cita.cliente.estatura) - (5 * vm.cita.cliente.edad) + 5).toFixed(2);
      }

      if(vm.cita.cliente.sexo == 'F'){
        //Mujeres TMB = (10 x peso en kg) + (6,25 × altura en cm) – (5 × edad en años) – 161
        vm.fData.metabolismo = ((10 * vm.fData.peso) + (6.25 * vm.cita.cliente.estatura) - (5 * vm.cita.cliente.edad) - 161).toFixed(2);
      }

      if(vm.fData.imc < 18.5){
        vm.fData.porcFlecha1 = 9;
        vm.fData.colorImc = '#3A6FFF';
      }else if(vm.fData.imc >= 18.5 && vm.fData.imc <= 24.9){
        vm.fData.porcFlecha1 = 25;
        vm.fData.colorImc = '#49C45B';
      }else if(vm.fData.imc >= 25 && vm.fData.imc <= 29.9){
        vm.fData.porcFlecha1 = 42;
        vm.fData.colorImc = '#FFFD43';
      }else if(vm.fData.imc >= 30 && vm.fData.imc <= 34.9){
        vm.fData.porcFlecha1 = 58;
        vm.fData.colorImc = '#FF985B';
      }else if(vm.fData.imc >= 35 && vm.fData.imc <= 39.9){
        vm.fData.porcFlecha1 = 75;
        vm.fData.colorImc = '#FF4747';
      }else if(vm.fData.imc >= 40){
        vm.fData.porcFlecha1 = 91;
        vm.fData.colorImc = '#D63235';
      }

      if(vm.fData.porc_masa_grasa > 59){
        vm.fData.porcFlecha2 = 98;
      }else{
        vm.fData.porcFlecha2 = parseInt((vm.fData.porc_masa_grasa * 100)/60);
      }
    }

    vm.btnRegistrarConsulta = function(){
      var datos={
        cita:vm.cita,
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
          /*$scope.changeViewConsulta(false);*/
          vm.callback();
          vm.changePestania(3);
          vm.fData.idatencion = rpta.idatencion;
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

    vm.btnActualizarConsulta = function(){
      var datos={
        cita:vm.cita,
        consulta:vm.fData
      };

      ConsultasServices.sActualizarConsulta(datos).then(function(rpta){
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
          /*$scope.changeViewConsulta(false);*/
          vm.callback();
          vm.changePestania(3);
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

    vm.btnGeneraPlan = function(){
      vm.fData.cita = vm.cita;
      $scope.changeViewPlan(true,vm.fData);
    }
  }
  function ConsultasServices($http, $q) {
    return({
        sRegistrarConsulta: sRegistrarConsulta,
        sActualizarConsulta:sActualizarConsulta,
        sAnularConsulta : sAnularConsulta,
        sCargarConsulta: sCargarConsulta,
        sCargarConsultasPaciente: sCargarConsultasPaciente,
    });
    function sRegistrarConsulta(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Consulta/registrar_consulta",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }

    function sActualizarConsulta(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Consulta/actualizar_consulta",
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
    function sCargarConsultasPaciente(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"Consulta/listar_consultas_paciente",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }

  }
})();
