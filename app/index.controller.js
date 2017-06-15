(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('MainController', MainController)
    .service('rootServices', rootServices)
    .directive('hcChart', function () {
      return {
          restrict: 'E',
          template: '<div></div>',
          scope: {
              options: '='
          },
          link: function (scope, element) {
            // scope.$watch(function () {
            //   return attrs.chart;
            // }, function () {
            //     if (!attrs.chart) return;
            //     var charts = JSON.parse(attrs.chart);
            //     $(element[0]).highcharts(charts);
                Highcharts.chart(element[0], scope.options);
            // });

          }
      };
  });

  /** @ngInject */
  function MainController($translate, $scope, rootServices, PacienteServices,$location) {
    var vm = this;
    // console.log('$translate',$translate);
    vm.changeLanguage = function (langKey) {
      // console.log('langKey',langKey);langKey
      $translate.use(langKey);
      vm.currentLanguage = langKey;
    };
    //vm.currentLanguage = $translate.proposedLanguage() || $translate.use();
    vm.changeLanguage('es');

    $scope.fSessionCI = {};

    $scope.isLoggedIn = false;
    $scope.logOut = function() {
      $scope.isLoggedIn = false;
      $scope.captchaValido = false;
    }

    $scope.logIn = function() {
      $scope.isLoggedIn = true;
    };

    $scope.btnLogoutToSystem = function () {
      rootServices.sLogoutSessionCI().then(function () {
        $scope.fSessionCI = {};
        $scope.listaUnidadesNegocio = {};
        $scope.listaModulos = {};
        $scope.logOut();
        $scope.goToUrl('/app/pages/login');
      });
    };
    $scope.buscarPaciente = function (paciente) {
      var paramDatos = {
        search: paciente
      }
      PacienteServices.sListarPacientePorNombre(paramDatos).then(function (rpta) {
      console.log(rpta.datos);
      $scope.paciente = rpta.datos;
      $scope.goToUrl('/app/paciente');
      });
    };

    $scope.goToUrl = function ( path ) {
      $location.path( path );
    };

    $scope.getValidateSession = function () {
      rootServices.sGetSessionCI().then(function (response) {
        //console.log(response);
        if(response.flag == 1){
          $scope.fSessionCI = response.datos;
          $scope.logIn();
          if( $location.path() == '/app/pages/login' ){
            $scope.goToUrl('/');
          }
        }else{
          $scope.fSessionCI = {};
          $scope.logOut();
          $scope.goToUrl('/app/pages/login');
        }
      });

    }
    $scope.getValidateSession();

    $scope.changeViewConsulta = function(value, pestania){
      $scope.viewConsulta = value;
      $scope.pestaniaConsulta = pestania;
    }
    $scope.changeViewConsulta(false);

    $scope.changeViewFicha = function(value){
      $scope.viewFicha = value;
    }
    $scope.changeViewFicha(false);

    $scope.changeViewPlan = function(value, consulta){
      $scope.viewPlan = value;
      $scope.consulta = consulta;
    }
    $scope.changeViewPlan(false);

    $scope.changeViewOnlyBodyCita = function(value, consulta, paciente){
      $scope.viewOnlyBodyCita = value;
      $scope.consultaOrigen = consulta;
      $scope.pacienteOrigen = paciente;
      console.log('llego aqui', $scope.pacienteOrigen);
    }
    $scope.changeViewOnlyBodyCita(false);

    $scope.changeViewCita = function(value){
      $scope.viewCita = value;
    }
    $scope.changeViewCita(true);

  }
  function rootServices($http, $q) {
    return({
        sLogoutSessionCI: sLogoutSessionCI,
        sGetSessionCI: sGetSessionCI,
    });
    function sLogoutSessionCI(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Acceso/logoutSessionCI",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
    function sGetSessionCI(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Acceso/getSessionCI",
            data : datos
      });
      return (request.then( handleSuccess,handleError ));
    }
  }
})();
