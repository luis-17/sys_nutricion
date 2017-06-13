(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('PlanAlimentarioController', PlanAlimentarioController)
    .service('PlanAlimentarioServices', PlanAlimentarioServices);

  /** @ngInject */
  function PlanAlimentarioController ($scope,$uibModal,alertify,toastr,PlanAlimentarioServices,DiaServices,TurnoServices,AlimentoServices) { 
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
          vm.dias[key].valoresGlobales = {
              calorias: 0,
              proteinas: 0,
              carbohidratos:0,
              grasas: 0,
              fibras: 0,
              cenizas: 0,
              calcio: 0,
              fosforo: 0,
              zinc: 0,
              hierro: 0,
            };
          angular.forEach(vm.dias[key].turnos, function(val, ind) {
            vm.dias[key].turnos[ind].hora = vm.horas[0];            
            vm.dias[key].turnos[ind].minuto = vm.minutos[0];            
            vm.dias[key].turnos[ind].tiempo = vm.tiempo[0];            
            vm.dias[key].turnos[ind].alimentos = [];            
            vm.dias[key].turnos[ind].valoresTurno = {
              calorias: 0,
              proteinas: 0,
              carbohidratos:0,
              grasas: 0,
              fibras: 0,
              cenizas: 0,
              calcio: 0,
              fosforo: 0,
              zinc: 0,
              hierro: 0,
            };            
          });
        });
        vm.dia = angular.copy(vm.dias[0]);  
        angular.forEach(vm.dia.turnos, function(val, ind) {
            vm.dia.turnos[ind].hora = vm.horas[0];            
            vm.dia.turnos[ind].minuto = vm.minutos[0];            
            vm.dia.turnos[ind].tiempo = vm.tiempo[0];            
            vm.dia.turnos[ind].alimentos = [];            
            vm.dia.turnos[ind].valoresTurno = {
              calorias: 0,
              proteinas: 0,
              carbohidratos:0,
              grasas: 0,
              fibras: 0,
              cenizas: 0,
              calcio: 0,
              fosforo: 0,
              zinc: 0,
              hierro: 0,
            };            
          });      
      });
    }); 

    vm.initPlan = function(origen,tipoVista,callbackCitas){
      vm.consulta = $scope.consulta;
      vm.origen = origen;
      vm.tipoVista = tipoVista;
      vm.callbackCitas = callbackCitas;
      //console.log(callbackCitas);
      //console.log('vm.consulta',vm.consulta);
      vm.formaPlan = 'dia';
      
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
        forma:vm.formaPlan,
        planDias:vm.dias,
        planGeneral:vm.dia,
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
          $scope.changeViewCita(true);
          $scope.changeViewOnlyBodyCita(false);
          $scope.changeViewConsulta(false);
          $scope.changeViewPlan(false);
          vm.callbackCitas();
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

    vm.getAlimentoAutocomplete = function (value) {
      var params = {};
      params.search= value;
      params.sensor= false;
        
      return AlimentoServices.sListaAlimentosAutocomplete(params).then(function(rpta) { 
        vm.noResultsLM = false;
        if( rpta.flag === 0 ){
          vm.noResultsLM = true;
        }
        return rpta.datos; 
      });
    }

    vm.getSelectedAlimento = function($item, $model, $label, indexDia, indexTurno, indexAlimento){
      var alternativo = false;
      if(vm.dias[indexDia].turnos[indexTurno].alimentos[indexAlimento].alternativo){
        alternativo = true;
      }
      vm.dias[indexDia].turnos[indexTurno].alimentos[indexAlimento] = $item;
      vm.dias[indexDia].turnos[indexTurno].alimentos[indexAlimento].alternativo = alternativo;
      vm.calcularValoresTurno(indexDia,indexTurno);
    }   

    vm.getSelectedTemporalAlimento = function($item, $model, $label, indexDia, indexTurno){
      vm.dias[indexDia].turnos[indexTurno].seleccionado = $item;
    }

    vm.agregarAlimento = function(indexDia, indexTurno){
      if(!(vm.dias[indexDia].turnos[indexTurno].seleccionado) ||
          vm.dias[indexDia].turnos[indexTurno].seleccionado.idalimento == null ||
          vm.dias[indexDia].turnos[indexTurno].seleccionado.idalimento == ''
        ){
        var openedToasts = [];
        vm.options = {
          timeout: '3000',
          extendedTimeout: '1000',
          preventDuplicates: false,
          preventOpenDuplicates: false
        };       
        var title = 'Advertencia';
        var iconClass = 'warning';        
        var toast = toastr[iconClass]('Debe seleccionar alimento.', title, vm.options);
        openedToasts.push(toast);
        return;
      }

      /*if(vm.dias[indexDia].turnos[indexTurno].temporalCantidad == null ||
          vm.dias[indexDia].turnos[indexTurno].temporalCantidad == ''
        ){
        var openedToasts = [];
        vm.options = {
          timeout: '3000',
          extendedTimeout: '1000',
          preventDuplicates: false,
          preventOpenDuplicates: false
        };       
        var title = 'Advertencia';
        var iconClass = 'warning';        
        var toast = toastr[iconClass]('Debe agregar cantidad.', title, vm.options);
        openedToasts.push(toast);
        return;
      }*/

      var copy1 = angular.copy(vm.dias[indexDia].turnos[indexTurno].seleccionado);
      var copy2 = angular.copy(vm.dias[indexDia].turnos[indexTurno].seleccionado);
      copy2.alternativo = true;
      var copy3 = angular.copy(vm.dias[indexDia].turnos[indexTurno].seleccionado);
      copy3.alternativo = true;

      vm.dias[indexDia].turnos[indexTurno].alimentos.push(copy1);
      vm.dias[indexDia].turnos[indexTurno].alimentos.push(copy2);
      vm.dias[indexDia].turnos[indexTurno].alimentos.push(copy3);

      vm.dias[indexDia].turnos[indexTurno].seleccionado = null;
      vm.dias[indexDia].turnos[indexTurno].temporal = null;
      vm.calcularValoresTurno(indexDia, indexTurno);
    }

    vm.calcularValoresTurno = function(indexDia, indexTurno){
      var total_calorias = 0;
      var total_proteinas = 0;
      var total_carbohidratos = 0;
      var total_grasas = 0;
      angular.forEach(vm.dias[indexDia].turnos[indexTurno].alimentos, function(alimento, ind) {                   
        total_calorias = total_calorias +alimento.calorias;
        total_proteinas = total_proteinas + alimento.proteinas;
        total_carbohidratos = total_carbohidratos +  alimento.carbohidratos;
        total_grasas = total_grasas + alimento.grasas;           
      });

      vm.dias[indexDia].turnos[indexTurno].valoresTurno.calorias = total_calorias;
      vm.dias[indexDia].turnos[indexTurno].valoresTurno.proteinas = total_proteinas;
      vm.dias[indexDia].turnos[indexTurno].valoresTurno.carbohidratos = total_carbohidratos;
      vm.dias[indexDia].turnos[indexTurno].valoresTurno.grasas = total_grasas; 

      vm.calcularValoresDia(indexDia , indexTurno);
    }

    vm.calcularValoresDia = function(indexDia , indexTurno){
      var total_calorias = 0;
      var total_proteinas = 0;
      var total_carbohidratos = 0;
      var total_grasas = 0;
      angular.forEach(vm.dias[indexDia].turnos, function(turno, ind) { 
        total_calorias = total_calorias + turno.valoresTurno.calorias;
        total_proteinas = total_proteinas + turno.valoresTurno.proteinas;
        total_carbohidratos = total_carbohidratos + turno.valoresTurno.carbohidratos;
        total_grasas = total_grasas + turno.valoresTurno.grasas;           
      });

      vm.dias[indexDia].valoresGlobales.calorias = total_calorias;
      vm.dias[indexDia].valoresGlobales.proteinas = total_proteinas;
      vm.dias[indexDia].valoresGlobales.carbohidratos = total_carbohidratos;
      vm.dias[indexDia].valoresGlobales.grasas = total_grasas; 
    }

    vm.eliminarAlimento = function(indexAlimento,indexTurno,indexDia){
      vm.dias[indexDia].turnos[indexTurno].alimentos.splice(indexAlimento,1);
      vm.calcularValoresTurno(indexDia,indexTurno);      
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
