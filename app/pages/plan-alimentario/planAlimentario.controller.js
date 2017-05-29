(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('PlanAlimentarioController', PlanAlimentarioController)
    .service('PlanAlimentarioServices', PlanAlimentarioServices);

  /** @ngInject */
  function PlanAlimentarioController ($scope,$uibModal,alertify,toastr,PlanAlimentarioServices,DiaServices,TurnoServices) { 
    var vm = this;
    vm.horas = [
      {id:0, value:'--'},
      {id:'01', value:'01'},
      {id:'02', value:'02'},
      {id:'03', value:'03'},
      {id:'04', value:'04'},
      {id:'05', value:'05'},
      {id:'06', value:'06'},
      {id:'07', value:'07'},
      {id:'08', value:'08'},
      {id:'09', value:'09'},
      {id:'10', value:'10'},
      {id:'11', value:'11'},
      {id:'12', value:'12'},
    ];

    vm.minutos = [
      {id:0, value:'--'},
      {id:'01', value:'00'},
      {id:'02', value:'15'},
      {id:'03', value:'30'},
      {id:'04', value:'45'},
    ];

    vm.tiempo = [
      {id:'am', value:'am'},
      {id:'pm', value:'pm'},
    ]; 

    DiaServices.sListarDiasCbo().then(function(rpta){
      vm.dias = rpta.datos;
      TurnoServices.sListarTurnosCbo().then(function(rpta){
        angular.forEach(vm.dias, function(value, key) {
          vm.dias[key].turnos = angular.copy(rpta.datos);
          angular.forEach(vm.dias[key].turnos, function(val, ind) {
            vm.dias[key].turnos[ind].hora = vm.horas[0];            
            vm.dias[key].turnos[ind].minuto = vm.minutos[0];            
            vm.dias[key].turnos[ind].tiempo = vm.tiempo[0];            
          });
        });
      });
    });    

    vm.initPlan = function(origen,tipoVista){
      vm.consulta = $scope.consulta;
      vm.origen = origen;
      vm.tipoVista = tipoVista;
      console.log('vm.consulta',vm.consulta);
      
      if(vm.tipoVista == 'new'){
        vm.fData = {};
      }else if(vm.tipoVista == 'edit'){
        /*ConsultasServices.sCargarConsulta(vm.cita).then(function(rpta){
          vm.fData = rpta.datos;
          vm.fData.fecha_atencion = new Date(vm.fData.fecha_atencion);
          vm.fData.kg_masa_grasa = parseFloat(((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_grasa)) / 100).toFixed(2));
          vm.fData.kg_masa_libre = parseFloat(((parseFloat(vm.fData.peso) * parseFloat(vm.fData.porc_masa_libre)) / 100).toFixed(2));
        });*/ 
        //cargar el plan almacenado        
      }
    }

    vm.changeSeleccionado = function(value){
      vm.seleccionadoTipo = value;
    }
    vm.changeSeleccionado(false);

    vm.seleccionaTipo = function(tipo){
      vm.changeSeleccionado(true);
      vm.tipoPlan = tipo;
    }

    vm.btnGuardarPlan = function(){
      console.log('vm.dias',vm.dias);
      var datos = {
        consulta:vm.consulta,
        tipo:vm.tipoPlan,
        plan:vm.dias,
      };
      PlanAlimentarioServices.sRegistrarPlan(datos).then(function(rpta){
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

  function PlanAlimentarioServices($http, $q) {
    return({
      sRegistrarPlan:sRegistrarPlan,
    });
    function sRegistrarPlan(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"PlanAlimentario/registrar_plan_alimentario",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
})();
