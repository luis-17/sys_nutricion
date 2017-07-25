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
        name: 'Grupo Etáreo.',
        colorByPoint: true,
        data: []
      }]
    }; 
    vm.fData.informe.chartConfigPesoIMC = { 
      chart: { 
          type: 'column',
          height: 350
      },
      title: {
          text: 'Dx. Nutricional según IMC.' 
      },
      xAxis: {
        type: 'category',
        labels: {
            rotation: -45
        }
      },
      yAxis: {
        min: 0,
        title: {
            text: 'Cant. de Consultas' 
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '<b>{point.y} </b> consultas' 
      }, 
      series: [{ 
        name: 'Diagnóstico según IMC. ',
        colorByPoint: true,
        data: [],
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#000000',
            align: 'right',
            format: '{point.y}'
        }
      }]
    }; 
    vm.fData.informe.chartConfigEdadPesoIMC = { 
      chart: { 
          type: 'column',
          height: 350
      },
      title: {
          text: 'Edad & Dx. Nutricional.' 
      },
      xAxis: {
        categories: [
            'JOVENES',
            'ADULTOS',
            'ADULTOS MAYORES' 
        ],
        crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Cant. de Consultas.'
          }
      },
      tooltip: { 
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y} u.</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
      },
      series: [] 
    }; 
    vm.fData.informe.chartConfigSexoPesoIMC = { 
      chart: { 
          type: 'column',
          height: 350
      },
      title: {
          text: 'Sexo & Dx. Nutricional.' 
      },
      xAxis: {
        categories: [
            'MASCULINO',
            'FEMENINO'
        ],
        crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Cant. de Consultas.'
          }
      },
      tooltip: { 
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y} u.</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
      },
      series: [] 
    }; 
    vm.fData.informe.chartConfigPPS = { 
      chart: { 
          type: 'pie',
          height: 250,

      },
      title: {
          text: 'PESO PERDIDO POR GÉNERO'
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
        labelFormat: '{name} ( {y} Kg.)' 
      },
      series: [{ 
        name: 'Género.',
        colorByPoint: true,
        data: []
      }]
    };
    vm.fData.informe.chartConfigPPE = { 
      chart: { 
          type: 'pie',
          height: 250,

      },
      title: {
          text: 'PESO PERDIDO POR EDAD' 
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
        labelFormat: '{name} ( {y} Kg.)' 
      },
      series: [{ 
        name: 'Edad.',
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
          vm.fData.informe.chartConfigPesoIMC.series[0].data = angular.copy(rpta.datos.pac_peso_graph); 
          vm.fData.informe.chartConfigEdadPesoIMC.series = angular.copy(rpta.datos.pac_edad_peso_graph); 
          vm.fData.informe.chartConfigSexoPesoIMC.series = angular.copy(rpta.datos.pac_sexo_peso_graph); 
          vm.fData.informe.peso_perdido = angular.copy(rpta.datos.peso_perdido);
          vm.fData.informe.chartConfigPPS.series[0].data = angular.copy(rpta.datos.peso_perdido_sexo_graph); 
          vm.fData.informe.chartConfigPPE.series[0].data = angular.copy(rpta.datos.peso_perdido_edad_graph); 
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
