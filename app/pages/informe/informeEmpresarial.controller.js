(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('InformeEmpresarialController', InformeEmpresarialController)
    .service('InformeEmpresarialServices', InformeEmpresarialServices);

  /** @ngInject */
  function InformeEmpresarialController($scope,$uibModal,$timeout,$filter,filterFilter, uiGridConstants,$document, alertify,toastr,
    InformeEmpresarialServices, EmpresaServices,GrupoServices,UsuarioServices, pinesNotifications) {

    var vm = this; 
    vm.fData = {};
    vm.fData.informe = {};
    /*vm.fData.informe = {
      chartOptionsPA: {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'PACIENTES POR GÉNERO'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' 
        },
        plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: true
          }
        }
      }
    }; */
/*,
        series: [{ 
          name: 'Sexo.',
          data: []
        }]*/
    vm.fParam = {};
    vm.fParam.infoVisible = false;
    vm.fParam.inicio = moment().format('01-MM-YYYY');
    vm.fParam.fin = moment().format('DD-MM-YYYY');
    console.log(vm.fParam.fin,'vm.fParam.fin'); 
    // LISTA DE EMPRESAS
    EmpresaServices.sListarEmpresaCbo().then(function (rpta) {
      vm.fData.listaEmpresas = angular.copy(rpta.datos);
      vm.fData.listaEmpresas.splice(0,0,{ id : '', descripcion:'--Seleccione una empresa--'}); 
      vm.fParam.empresa = vm.fData.listaEmpresas[0];
    }); 

    // CARGAR GRAFICO
    // vm.cargarEvolucion = function(row){
    //   PacienteServices.slistarEvolucion(row).then(function(rpta){
    //     // console.log('rpta', rpta.datos.peso);

    //     if(rpta.datos.peso[0].data.length >= 2){
    //       vm.sinGrafico = false;
    //     }else{
    //       vm.sinGrafico = true;
    //     }

    //     vm.chartOptions1 = {
    //       chart: {
    //           type: 'line'
    //       },
    //       title: {
    //           text: 'Peso'
    //       },
    //       xAxis: {
    //           categories: []
    //       },
    //       yAxis: {
    //         title: {
    //             text: 'Peso en Kg.'
    //         },
    //         plotLines: [{
    //             value: 0,
    //             width: 1,
    //             color: '#808080'
    //         }]
    //       },
    //     };
    //     vm.chartOptions1.series = rpta.datos.peso;
    //     vm.chartOptions1.xAxis.categories = rpta.datos.xAxis;
    //     vm.chartOptions1.chart.events = {
    //       load: function () {
    //         var thes = this;
    //         setTimeout(function () {
    //             thes.setSize($("#chartOptions1").parent().width(), $("#chartOptions1").parent().height());
    //         }, 10);
    //       }
    //     };
    //   });
    // }
    /**/
    vm.fData.informe.chartConfigPA = { 
      chart: { 
          type: 'pie',
          height: 250,

      },
      title: {
          text: 'PACIENTES POR GÉNERO'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' 
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
        }
      },
      legend: {
        labelFormat: '{name} ( {y} )' 
      },
      series: [{ 
        name: 'Sexo.',
        colorByPoint: true,
        data: []
      }]
    }; 
    vm.fData.informe.chartConfigEdad = { 
      chart: { 
          type: 'pie',
          height: 250,

      },
      title: {
          text: 'PACIENTES POR EDAD'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' 
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
        }
      },
      legend: {
        labelFormat: '{name} ( {y} )' 
      },
      series: [{ 
        name: 'Sexo.',
        colorByPoint: true,
        data: []
      }]
    }; 
    vm.fParam.generarInformeEmpresarial = function() { 
      InformeEmpresarialServices.sListarInformeEmpresa(vm.fParam).then(function (rpta) {
        if( rpta.flag == 1 ){
          vm.fParam.infoVisible = true;
          vm.fData.informe.pac_atendidos = angular.copy(rpta.datos.pac_atendidos);
          vm.fData.informe.chartConfigPA.series[0].data = angular.copy(rpta.datos.pac_sexo_graph); 
          vm.fData.informe.chartConfigEdad.series[0].data = angular.copy(rpta.datos.pac_edad_graph); 
        }else{
          vm.fParam.infoVisible = false;
        }
      }); 
    }
  }
  function InformeEmpresarialServices($http, $q) {
    return({
        sListarInformeEmpresa: sListarInformeEmpresa
    });
    function sListarInformeEmpresa(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "InformeEmpresarial/listar_informe_empresarial",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }            
  }
})();
