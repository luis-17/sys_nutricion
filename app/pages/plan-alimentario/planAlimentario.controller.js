(function() {
  'use strict';
  angular
    .module('minotaur')
    .controller('PlanAlimentarioController', PlanAlimentarioController)
    .service('PlanAlimentarioServices', PlanAlimentarioServices);

  /** @ngInject */
  function PlanAlimentarioController ($scope,$uibModal,alertify,toastr,PlanAlimentarioServices,DiaServices,TurnoServices,AlimentoServices, pageLoading, ModalReporteFactory) { 
    var vm = this;
    vm.horas = [
      {id: '--', value:'--'},
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
      {id: '--', value:'--'},
      {id:'00', value:'00'},
      {id:'15', value:'15'},
      {id:'30', value:'30'},
      {id:'45', value:'45'},
    ];

    vm.tiempo = [
      {id:'am', value:'am'},
      {id:'pm', value:'pm'},
    ]; 

    
    vm.initPlan = function(consulta,origen,tipoVista,callbackCitas){      
      pageLoading.start('Cargando formulario');
      vm.consulta = consulta;
      vm.origen = origen;
      vm.tipoVista = tipoVista;
      vm.callbackCitas = callbackCitas;
      console.log('vm.origen',vm.origen);
      if(vm.origen == 'consulta' && vm.consulta.tipo_dieta != null){
        vm.tipoVista = 'edit';
      }

      vm.changeTab('1');

      if(vm.tipoVista == 'edit'){
        vm.cargaEstructura();
      }else{
        pageLoading.stop();
      }      
    }

    vm.changeTab = function(indexTab){
      vm.activeTab = indexTab;
    }

    vm.cargaEstructura = function(){
      pageLoading.start('Cargando formulario');
      if(vm.tipoVista == 'new'){
        vm.fData = {};
        vm.formaPlan = 'dia';
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
            pageLoading.stop();
          });
        });
      }else if(vm.tipoVista == 'edit'){
        var tipo;
        var forma;
        if(vm.consulta.tipo_dieta == 'SG'){
          tipo = 'simple';
          forma = 'general';
        }else if(vm.consulta.tipo_dieta == 'CG'){
          tipo = 'compuesto';
          forma = 'general';
        }else if(vm.consulta.tipo_dieta == 'SD'){
          tipo = 'simple';
          forma = 'dia';
        }else if(vm.consulta.tipo_dieta == 'CD'){
          tipo = 'compuesto';
          forma = 'dia';
        }
        vm.formaPlan = forma;
        vm.seleccionaTipo(tipo);
        vm.indicaciones = vm.consulta.indicaciones_dieta;

        PlanAlimentarioServices.sCargarPlan(vm.consulta).then(function(rpta){
          vm.dia = angular.copy(rpta.datos[0]);
          vm.dias = angular.copy(rpta.datos);          
          vm.primeraCargaGeneral = false;
          vm.primeraCargaDia = false;
          vm.updateEstructura(true);          
        });       
      }
    }

    vm.updateEstructura = function(load){
      //console.log('paso por aqui...',load);
      if(vm.tipoVista == 'edit'){
        if(load){
          pageLoading.start('Cargando Plan alimentario...');
        }
        
        if(vm.formaPlan == 'general' && !vm.primeraCargaGeneral){
          vm.primeraCargaGeneral = true;
          angular.forEach(vm.dia.turnos, function(val, ind) {
            var objIndex = 0;
            objIndex = vm.horas.filter(function(obj) {
              return obj.id == vm.dia.turnos[ind].hora;
            }).shift();                 
            vm.dia.turnos[ind].hora = objIndex; 
            //console.log(objIndex);  

            objIndex = vm.minutos.filter(function(obj) {
              return obj.id == vm.dia.turnos[ind].min;
            }).shift(); 
            vm.dia.turnos[ind].minuto = objIndex; 
            //console.log(objIndex);

            objIndex = vm.tiempo.filter(function(obj) {
              return obj.id == vm.dia.turnos[ind].tiempo;
            }).shift();            
            vm.dia.turnos[ind].tiempo = objIndex;
            //console.log(objIndex);

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

            if(vm.tipoPlan == 'compuesto'){
              if(!vm.dia.turnos[ind].alimentos){
                vm.dia.turnos[ind].alimentos = [];
              }else{
                vm.dia.turnos[ind].alimentos = Object.values(vm.dia.turnos[ind].alimentos); 
              }  

              angular.forEach(vm.dia.turnos[ind].alimentos, function(alimento, indAli){                               
                if(!vm.dia.turnos[ind].alimentos[indAli].alternativos){ 
                  vm.dia.turnos[ind].alimentos[indAli].alternativos = [
                                                          {nombre_compuesto:'', idalimento:0, cantidad:null},
                                                          {nombre_compuesto:'', idalimento:0, cantidad:null}
                                                          ];
                }else{
                  vm.dia.turnos[ind].alimentos[indAli].alternativos = Object.values(vm.dia.turnos[ind].alimentos[indAli].alternativos); 
                  if(vm.dia.turnos[ind].alimentos[indAli].alternativos.length == 1){
                    vm.dia.turnos[ind].alimentos[indAli].alternativos.push({nombre_compuesto:'', idalimento:0, cantidad:null});
                  }                  
                }
              });
              vm.calcularValoresTurno(null, ind);
            }            
          });
        }else if(vm.formaPlan == 'dia' && !vm.primeraCargaDia){
          vm.primeraCargaDia = true;
          angular.forEach(vm.dias, function(dia, key) {
            angular.forEach(vm.dias[key].turnos, function(val, ind) {
              var objIndex = 0;
              objIndex = vm.horas.filter(function(obj) {
                return obj.id == vm.dias[key].turnos[ind].hora;
              }).shift();                 
              vm.dias[key].turnos[ind].hora = objIndex; 
              //console.log(objIndex);  

              objIndex = vm.minutos.filter(function(obj) {
                return obj.id == vm.dias[key].turnos[ind].min;
              }).shift(); 
              vm.dias[key].turnos[ind].minuto = objIndex; 
              //console.log(objIndex);

              objIndex = vm.tiempo.filter(function(obj) {
                return obj.id == vm.dias[key].turnos[ind].tiempo;
              }).shift();            
              vm.dias[key].turnos[ind].tiempo = objIndex;
              //console.log(objIndex);

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

              if(vm.tipoPlan == 'compuesto'){
                if(!vm.dias[key].turnos[ind].alimentos){
                  vm.dias[key].turnos[ind].alimentos = [];
                }else{
                  vm.dias[key].turnos[ind].alimentos = Object.values(vm.dias[key].turnos[ind].alimentos); 
                }  

                angular.forEach(vm.dias[key].turnos[ind].alimentos, function(alimento, indAli){                               
                  if(!vm.dias[key].turnos[ind].alimentos[indAli].alternativos){ 
                    vm.dias[key].turnos[ind].alimentos[indAli].alternativos = [
                                                            {nombre_compuesto:'', idalimento:0, cantidad:null},
                                                            {nombre_compuesto:'', idalimento:0, cantidad:null}
                                                            ];
                  }else{
                    vm.dias[key].turnos[ind].alimentos[indAli].alternativos = Object.values(vm.dias[key].turnos[ind].alimentos[indAli].alternativos); 
                    if(vm.dias[key].turnos[ind].alimentos[indAli].alternativos.length == 1){
                      vm.dias[key].turnos[ind].alimentos[indAli].alternativos.push({nombre_compuesto:'', idalimento:0, cantidad:null});
                    }                  
                  }
                });
                vm.calcularValoresTurno(key, ind);
              }            
            });
          });
        }
        if(load){
          pageLoading.stop();
        }        
      }
    }

    vm.changeSeleccionado = function(value){
      vm.seleccionadoTipo = value;
    }
    vm.changeSeleccionado(false);

    vm.seleccionaTipo = function(tipo){
      vm.changeSeleccionado(true);
      vm.tipoPlan = tipo;
      if(vm.tipoVista == 'new'){
        vm.cargaEstructura();
      }      
    }

    vm.btnGuardarPlan = function(){
      pageLoading.start('Registrando plan...');
      console.log('vm.dias',vm.dias);
      var datos = {
        consulta:vm.consulta,
        tipo:vm.tipoPlan,
        forma:vm.formaPlan,
        planDias:vm.dias,
        planGeneral:vm.dia,
        indicaciones:vm.indicaciones,
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
          /*if(vm.origen == 'cita'){
            $scope.changeViewCita(true);
            $scope.changeViewOnlyBodyCita(false);
            $scope.changeViewConsulta(false);
            $scope.changeViewPlan(false);
            $scope.changeViewSoloPlan(false);
          }else if(vm.origen == 'consulta'){ 
            $scope.changeViewConsulta(true,3,vm.consulta.idatencion,'plan');
            $scope.changeViewCita(false);
            $scope.changeViewOnlyBodyCita(false);
            $scope.changeViewPlan(false);
            $scope.changeViewSoloPlan(false);
          }*/
          vm.consulta.tipo_dieta = rpta.tipo_dieta;
          vm.consulta.indicaciones_dieta = rpta.indicaciones_dieta; 
          vm.tipoVista = 'edit';
          vm.callbackCitas();
          vm.cargaEstructura();  
          vm.changeTab('1');         
        }else if( rpta.flag == 0 ){
          var title = 'Advertencia';
          var iconClass = 'warning';
        }else{
          alert('Ocurrió un error');
        }
        pageLoading.stop();
        var toast = toastr[iconClass](rpta.message, title, vm.options);
        openedToasts.push(toast);
      });
    }

    vm.btnActualizarPlan = function(){
      console.log('vm.dias',vm.dias);
      var datos = {
        consulta:vm.consulta,
        tipo:vm.tipoPlan,
        forma:vm.formaPlan,
        planDias:vm.dias,
        planGeneral:vm.dia,
        indicaciones:vm.indicaciones,
      };
      PlanAlimentarioServices.sActualizarPlan(datos).then(function(rpta){
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
          /*if(vm.origen == 'cita'){
            $scope.changeViewCita(true);
            $scope.changeViewOnlyBodyCita(false);
            $scope.changeViewConsulta(false);
            $scope.changeViewPlan(false);
            $scope.changeViewSoloPlan(false);            
          }else if(vm.origen == 'consulta'){
            $scope.changeViewCita(false);
            $scope.changeViewOnlyBodyCita(false);
            $scope.changeViewConsulta(true,3,vm.consulta.idatencion, 'plan');
            $scope.changeViewPlan(false);
            $scope.changeViewSoloPlan(false);
          }*/
          vm.consulta.tipo_dieta = rpta.tipo_dieta;
          vm.consulta.indicaciones_dieta = rpta.indicaciones_dieta; 
          vm.cargaEstructura();
          vm.callbackCitas();
          vm.tipoVista = 'edit';
          vm.changeTab('1');
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

    vm.getSelectedAlimento = function($item, $model, $label, indexDia, indexTurno, indexAlimento, indexAlimentoAlt){      
      var cantidad = 0; 
      if(vm.formaPlan == 'dia'){
        cantidad = vm.dias[indexDia].turnos[indexTurno].alimentos[indexAlimento].cantidad;
        vm.dias[indexDia].turnos[indexTurno].alimentos[indexAlimento] = $item;
        vm.dias[indexDia].turnos[indexTurno].alimentos[indexAlimento].cantidad = cantidad;
      }else if(vm.formaPlan == 'general'){
        var alternativos = angular.copy(vm.dia.turnos[indexTurno].alimentos[indexAlimento].alternativos);
        cantidad = angular.copy(vm.dia.turnos[indexTurno].alimentos[indexAlimento].cantidad);

        console.log('indexAlimentoAlt',indexAlimentoAlt);
        if(!isNaN(indexAlimentoAlt) && indexAlimentoAlt != null){
          vm.dia.turnos[indexTurno].alimentos[indexAlimento].alternativos[indexAlimentoAlt] = $item;
          vm.dia.turnos[indexTurno].alimentos[indexAlimento].alternativos[indexAlimentoAlt].cantidad = cantidad;
        }else{
          vm.dia.turnos[indexTurno].alimentos[indexAlimento] = $item;
          vm.dia.turnos[indexTurno].alimentos[indexAlimento].cantidad = cantidad;
          vm.dia.turnos[indexTurno].alimentos[indexAlimento].alternativos = alternativos;
        }        
      }
      vm.calcularValoresTurno(indexDia,indexTurno);
    }   

    vm.getSelectedTemporalAlimento = function($item, $model, $label, indexDia, indexTurno){
      if(vm.formaPlan == 'dia'){
        vm.dias[indexDia].turnos[indexTurno].seleccionado = $item;
        vm.dias[indexDia].turnos[indexTurno].temporalCantidad = 1;
      }else if(vm.formaPlan == 'general'){
        vm.dia.turnos[indexTurno].seleccionado = $item;
        vm.dia.turnos[indexTurno].temporalCantidad = 1;
      }
    }

    vm.agregarAlimento = function(indexDia, indexTurno){
      if(vm.formaPlan == 'dia'){
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

        if(vm.dias[indexDia].turnos[indexTurno].temporalCantidad == null ||
            vm.dias[indexDia].turnos[indexTurno].temporalCantidad == '' ||
            vm.dias[indexDia].turnos[indexTurno].temporalCantidad <= 0
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
        }

        vm.dias[indexDia].turnos[indexTurno].alimentos.push(vm.dias[indexDia].turnos[indexTurno].seleccionado);
        vm.dias[indexDia].turnos[indexTurno].alimentos[vm.dias[indexDia].turnos[indexTurno].alimentos.length - 1].cantidad = vm.dias[indexDia].turnos[indexTurno].temporalCantidad; 
        vm.dias[indexDia].turnos[indexTurno].seleccionado = null;
        vm.dias[indexDia].turnos[indexTurno].temporalCantidad = null;
        vm.dias[indexDia].turnos[indexTurno].temporal = null;    
      }else if(vm.formaPlan == 'general'){
        if(!(vm.dia.turnos[indexTurno].seleccionado) ||
            vm.dia.turnos[indexTurno].seleccionado.idalimento == null ||
            vm.dia.turnos[indexTurno].seleccionado.idalimento == ''
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

        if(vm.dia.turnos[indexTurno].temporalCantidad == null ||
            vm.dia.turnos[indexTurno].temporalCantidad == '' ||
            vm.dia.turnos[indexTurno].temporalCantidad <= 0
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
        }

        vm.dia.turnos[indexTurno].alimentos.push(vm.dia.turnos[indexTurno].seleccionado);
        vm.dia.turnos[indexTurno].alimentos[vm.dia.turnos[indexTurno].alimentos.length - 1].cantidad = vm.dia.turnos[indexTurno].temporalCantidad; 
        vm.dia.turnos[indexTurno].alimentos[vm.dia.turnos[indexTurno].alimentos.length - 1].alternativos = [{nombre_compuesto:'', idalimento:0, cantidad:null},
                                                                                                            {nombre_compuesto:'', idalimento:0, cantidad:null}];
        vm.dia.turnos[indexTurno].seleccionado = null;
        vm.dia.turnos[indexTurno].temporalCantidad = null;
        vm.dia.turnos[indexTurno].temporal = null;
      }

      vm.calcularValoresTurno(indexDia, indexTurno);
    }

    vm.calcularValoresTurno = function(indexDia, indexTurno){
      var total_calorias = 0;
      var total_proteinas = 0;
      var total_carbohidratos = 0;
      var total_grasas = 0;      
      var total_fibras = 0;
      var total_cenizas = 0;
      var total_calcio = 0;
      var total_fosforo = 0;
      var total_zinc = 0;
      var total_hierro = 0;

      if(vm.formaPlan == 'dia'){
        angular.forEach(vm.dias[indexDia].turnos[indexTurno].alimentos, function(alimento, ind) { 
          var cantidad = parseFloat(alimento.cantidad);                  
          total_calorias = total_calorias + (cantidad * alimento.calorias);
          total_proteinas = total_proteinas + (cantidad * alimento.proteinas);
          total_carbohidratos = total_carbohidratos + (cantidad * alimento.carbohidratos);
          total_grasas = total_grasas + (cantidad * alimento.grasas);           
          total_fibras = total_fibras + (cantidad * alimento.fibra);           
          total_cenizas = total_cenizas + (cantidad * alimento.ceniza);           
          total_calcio = total_calcio + (cantidad * alimento.calcio);           
          total_fosforo = total_fosforo + (cantidad * alimento.fosforo);           
          total_zinc = total_zinc + (cantidad * alimento.zinc);           
          total_hierro = total_hierro + (cantidad * alimento.hierro);           
        });

        vm.dias[indexDia].turnos[indexTurno].valoresTurno.calorias = (parseFloat(total_calorias)).toFixed(2);
        vm.dias[indexDia].turnos[indexTurno].valoresTurno.proteinas = (parseFloat(total_proteinas)).toFixed(2);
        vm.dias[indexDia].turnos[indexTurno].valoresTurno.carbohidratos = (parseFloat(total_carbohidratos)).toFixed(2);
        vm.dias[indexDia].turnos[indexTurno].valoresTurno.grasas = (parseFloat(total_grasas)).toFixed(2);
        vm.dias[indexDia].turnos[indexTurno].valoresTurno.fibras = (parseFloat(total_fibras)).toFixed(2);
        vm.dias[indexDia].turnos[indexTurno].valoresTurno.cenizas = (parseFloat(total_cenizas)).toFixed(2);
        vm.dias[indexDia].turnos[indexTurno].valoresTurno.calcio = (parseFloat(total_calcio)).toFixed(2);
        vm.dias[indexDia].turnos[indexTurno].valoresTurno.fosforo = (parseFloat(total_fosforo)).toFixed(2);
        vm.dias[indexDia].turnos[indexTurno].valoresTurno.zinc = (parseFloat(total_zinc)).toFixed(2);
        vm.dias[indexDia].turnos[indexTurno].valoresTurno.hierro = (parseFloat(total_hierro)).toFixed(2);
      }else if(vm.formaPlan == 'general'){
        angular.forEach(vm.dia.turnos[indexTurno].alimentos, function(alimento, ind) { 
          var cantidad = parseFloat(alimento.cantidad);                  
          total_calorias = total_calorias + (cantidad * alimento.calorias);
          total_proteinas = total_proteinas + (cantidad * alimento.proteinas);
          total_carbohidratos = total_carbohidratos + (cantidad * alimento.carbohidratos);
          total_grasas = total_grasas + (cantidad * alimento.grasas);           
          total_fibras = total_fibras + (cantidad * alimento.fibra);           
          total_cenizas = total_cenizas + (cantidad * alimento.ceniza);           
          total_calcio = total_calcio + (cantidad * alimento.calcio);           
          total_fosforo = total_fosforo + (cantidad * alimento.fosforo);           
          total_zinc = total_zinc + (cantidad * alimento.zinc);           
          total_hierro = total_hierro + (cantidad * alimento.hierro);           
        });

        vm.dia.turnos[indexTurno].valoresTurno.calorias = (parseFloat(total_calorias)).toFixed(2);
        vm.dia.turnos[indexTurno].valoresTurno.proteinas = (parseFloat(total_proteinas)).toFixed(2);
        vm.dia.turnos[indexTurno].valoresTurno.carbohidratos = (parseFloat(total_carbohidratos)).toFixed(2);
        vm.dia.turnos[indexTurno].valoresTurno.grasas = (parseFloat(total_grasas)).toFixed(2);
        vm.dia.turnos[indexTurno].valoresTurno.fibras = (parseFloat(total_fibras)).toFixed(2);
        vm.dia.turnos[indexTurno].valoresTurno.cenizas = (parseFloat(total_cenizas)).toFixed(2);
        vm.dia.turnos[indexTurno].valoresTurno.calcio = (parseFloat(total_calcio)).toFixed(2);
        vm.dia.turnos[indexTurno].valoresTurno.fosforo = (parseFloat(total_fosforo)).toFixed(2);
        vm.dia.turnos[indexTurno].valoresTurno.zinc = (parseFloat(total_zinc)).toFixed(2);
        vm.dia.turnos[indexTurno].valoresTurno.hierro = (parseFloat(total_hierro)).toFixed(2);
      }
      vm.calcularValoresDia(indexDia , indexTurno);
    }

    vm.calcularValoresDia = function(indexDia , indexTurno){
      var total_calorias = 0;
      var total_proteinas = 0;
      var total_carbohidratos = 0;
      var total_grasas = 0;
      var total_fibras = 0;
      var total_cenizas = 0;
      var total_calcio = 0;
      var total_fosforo = 0;
      var total_zinc = 0;
      var total_hierro = 0;
      if(vm.formaPlan == 'dia'){
        angular.forEach(vm.dias[indexDia].turnos, function(turno, ind) { 
          total_calorias = total_calorias + turno.valoresTurno.calorias;
          total_proteinas = total_proteinas + turno.valoresTurno.proteinas;
          total_carbohidratos = total_carbohidratos + turno.valoresTurno.carbohidratos;
          total_grasas = total_grasas + turno.valoresTurno.grasas;           
          total_fibras = total_fibras + turno.valoresTurno.fibras;           
          total_cenizas = total_cenizas + turno.valoresTurno.cenizas;           
          total_calcio = total_calcio + turno.valoresTurno.calcio;           
          total_fosforo = total_fosforo + turno.valoresTurno.fosforo;           
          total_zinc = total_zinc + turno.valoresTurno.zinc;           
          total_hierro = total_hierro + turno.valoresTurno.hierro;           
        });

        vm.dias[indexDia].valoresGlobales.calorias = (parseFloat(total_calorias)).toFixed(2);
        vm.dias[indexDia].valoresGlobales.proteinas = (parseFloat(total_proteinas)).toFixed(2);
        vm.dias[indexDia].valoresGlobales.carbohidratos = (parseFloat(total_carbohidratos)).toFixed(2);
        vm.dias[indexDia].valoresGlobales.grasas = (parseFloat(total_grasas)).toFixed(2);
        vm.dias[indexDia].valoresGlobales.fibras = (parseFloat(total_fibras)).toFixed(2);
        vm.dias[indexDia].valoresGlobales.cenizas = (parseFloat(total_cenizas)).toFixed(2);
        vm.dias[indexDia].valoresGlobales.calcio = (parseFloat(total_calcio)).toFixed(2);
        vm.dias[indexDia].valoresGlobales.fosforo = (parseFloat(total_fosforo)).toFixed(2);
        vm.dias[indexDia].valoresGlobales.zinc = (parseFloat(total_zinc)).toFixed(2);
        vm.dias[indexDia].valoresGlobales.hierro = (parseFloat(total_hierro)).toFixed(2);
      }else if(vm.formaPlan == 'general'){
        angular.forEach(vm.dia.turnos, function(turno, ind) { 
          total_calorias = total_calorias + turno.valoresTurno.calorias;
          total_proteinas = total_proteinas + turno.valoresTurno.proteinas;
          total_carbohidratos = total_carbohidratos + turno.valoresTurno.carbohidratos;
          total_grasas = total_grasas + turno.valoresTurno.grasas;           
          total_fibras = total_fibras + turno.valoresTurno.fibras;           
          total_cenizas = total_cenizas + turno.valoresTurno.cenizas;           
          total_calcio = total_calcio + turno.valoresTurno.calcio;           
          total_fosforo = total_fosforo + turno.valoresTurno.fosforo;           
          total_zinc = total_zinc + turno.valoresTurno.zinc;           
          total_hierro = total_hierro + turno.valoresTurno.hierro;           
        });

        vm.dia.valoresGlobales.calorias = (parseFloat(total_calorias)).toFixed(2);
        vm.dia.valoresGlobales.proteinas = (parseFloat(total_proteinas)).toFixed(2);
        vm.dia.valoresGlobales.carbohidratos = (parseFloat(total_carbohidratos)).toFixed(2);
        vm.dia.valoresGlobales.grasas = (parseFloat(total_grasas)).toFixed(2);
        vm.dia.valoresGlobales.fibras = (parseFloat(total_fibras)).toFixed(2);
        vm.dia.valoresGlobales.cenizas = (parseFloat(total_cenizas)).toFixed(2);
        vm.dia.valoresGlobales.calcio = (parseFloat(total_calcio)).toFixed(2);
        vm.dia.valoresGlobales.fosforo = (parseFloat(total_fosforo)).toFixed(2);
        vm.dia.valoresGlobales.zinc = (parseFloat(total_zinc)).toFixed(2);
        vm.dia.valoresGlobales.hierro = (parseFloat(total_hierro)).toFixed(2);
      }
    }

    vm.eliminarAlimento = function(indexAlimento,indexTurno,indexDia, indexAlimentoAlt){
      if(vm.formaPlan == 'dia'){
        vm.dias[indexDia].turnos[indexTurno].alimentos.splice(indexAlimento,1);
        vm.calcularValoresTurno(indexDia,indexTurno);
      }else if(vm.formaPlan=='general'){
        console.log('indexAlimentoAlt',indexAlimentoAlt);
        if(!isNaN(indexAlimentoAlt) && indexAlimentoAlt != null){
          vm.dia.turnos[indexTurno].alimentos[indexAlimento].alternativos[indexAlimentoAlt].nombre_compuesto = '';
          vm.dia.turnos[indexTurno].alimentos[indexAlimento].alternativos[indexAlimentoAlt].idalimento = 0;
          vm.dia.turnos[indexTurno].alimentos[indexAlimento].alternativos[indexAlimentoAlt].cantidad = null;          
        }else{
          vm.dia.turnos[indexTurno].alimentos.splice(indexAlimento,1);
          vm.calcularValoresTurno(indexDia,indexTurno);
        }
      }
      vm.calcularValoresTurno(indexDia,indexTurno);            
    }

    vm.viewDetalle = function(indexDia, indexTurno,indexAlimento, indexAlimentoAlt){
      if(vm.formaPlan == 'dia'){
        vm.fDataAlimento = vm.dias[indexDia].turnos[indexTurno].alimentos[indexAlimento];
        console.log(vm.dias[indexDia].turnos[indexTurno].alimentos[indexAlimento]);
      }else if(vm.formaPlan=='general'){
        console.log('indexAlimentoAlt',indexAlimentoAlt);
        if(!isNaN(indexAlimentoAlt) && indexAlimentoAlt != null){
          vm.fDataAlimento = vm.dia.turnos[indexTurno].alimentos[indexAlimento].alternativos[indexAlimentoAlt];         
          console.log(vm.dia.turnos[indexTurno].alimentos[indexAlimento].alternativos[indexAlimentoAlt]);         
        }else{
          vm.fDataAlimento = vm.dia.turnos[indexTurno].alimentos[indexAlimento];
          console.log(vm.dia.turnos[indexTurno].alimentos[indexAlimento]);
        }
      }

      pageLoading.start('Cargando formulario...');
      var modalInstance = $uibModal.open({
        templateUrl:'app/pages/alimento/alimentoViewDetalle_formView.html',        
        controllerAs: 'modalAli',
        size: 'lg',
        backdropClass: 'splash splash-ef-14',
        windowClass: 'splash splash-ef-14',
        controller: function($scope, $uibModalInstance, arrToModal){
          var vm = this;
          vm.fData = arrToModal.fDataAlimento;
          vm.modalTitle = 'Informacion Nutricional';

          vm.cancel = function () {
            $uibModalInstance.close();
          };

          pageLoading.stop();          
        },
        resolve: {
            arrToModal: function() {
              return {
                fDataAlimento : vm.fDataAlimento,
                // document: $document,
                // listaSexos : $scope.listaSexos,
                // gridComboOptions : $scope.gridComboOptions,
                // mySelectionComboGrid : $scope.mySelectionComboGrid
              }
            }
          }        
      });
    } 

    vm.btnImprimirPlan = function(){
      var arrParams = {
        titulo: 'PLAN ALIMENTARIO',
        datos:{
          cita:vm.consultacita,
          consulta:vm.consulta,
          salida: 'pdf',
          tituloAbv: 'Plan Alimentario',
          titulo: 'Plan Alimentario'
        },
        metodo: 'php',
        url: angular.patchURLCI + "PlanAlimentario/generar_pdf_plan"
      }
      ModalReporteFactory.getPopupReporte(arrParams);
    }      
  }

  function PlanAlimentarioServices($http, $q) {
    return({
      sRegistrarPlan:sRegistrarPlan,
      sCargarPlan:sCargarPlan,
      sActualizarPlan:sActualizarPlan,
      sGenerarPdfPlan:sGenerarPdfPlan,
    });
    function sRegistrarPlan(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"PlanAlimentario/registrar_plan_alimentario",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }    
    function sCargarPlan(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"PlanAlimentario/cargar_plan_alimentario",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }    
    function sActualizarPlan(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"PlanAlimentario/actualizar_plan_alimentario",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
    function sGenerarPdfPlan(datos) {
      var request = $http({
            method : "post",
            url : angular.patchURLCI+"PlanAlimentario/generar_pdf_plan",
            data : datos
      });
      return (request.then(handleSuccess,handleError));
    }
  }
})();
