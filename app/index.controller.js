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
    })
    .factory("pageLoading", function(){
      var pageLoading = {
        start: function(text){
            var page = angular.element('#page-loading');
            var pageText = angular.element('.page-loading-text');
            page.addClass('visible');
            pageText.text(text);
        },
        stop: function(){
            var page = angular.element('#page-loading');
            var pageText = angular.element('.page-loading-text');
            page.removeClass('visible');
            pageText.text('');
        }
      }
      return pageLoading;
    })
    .factory('pinesNotifications', ['$window', function ($window) {
      'use strict';
      return {
        notify: function (args) {
          args.styling = 'fontawesome';
          args.mouse_reset = false;
          var notification = new $window.PNotify(args);
          notification.notify = notification.update;
          return notification;
        },
      };
    }]);

  /** @ngInject */
  function MainController($translate, $scope, $state, rootServices, $uibModal,PacienteServices,UsuarioServices,$location,pinesNotifications) {
    var vm = this; 

    // var currentPageTemplate = $route.current.templateUrl;
    // console.log(currentPageTemplate,'currentPageTemplate aaaaaaaaaaaaaa');
    // $templateCache.remove(currentPageTemplate);
    // $route.reload();

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
    $scope.btnChangePassword = function() {
      var modalInstance = $uibModal.open({
        templateUrl: 'password.html',
        controllerAs: 'ps',
        size: 'sm',
        scope: $scope,
        backdropClass: 'splash',
        windowClass: 'splash',          
        controller: function($scope, $uibModalInstance){
          var vm = this;
          vm.fData = {};
          vm.modalTitle = 'Cambio de Clave';  
          vm.fData.idusuario = $scope.fSessionCI.idusuario;
          //console.log("sesion: ",$scope.fSessionCI.idusuario);     
          // BOTONES
          vm.aceptar = function () {
            UsuarioServices.sCambiarClave(vm.fData).then(function (rpta) { 
              if(rpta.flag == 1){ 
                //data.usuario = vm.fData.username;
                $uibModalInstance.close();          
                var pTitle = 'OK!';
                var pType = 'success';
              }else if( rpta.flag == 0 ){
                var pTitle = 'Advertencia!';
                var pType = 'warning';  
              }else{
                alert('Ocurrió un error');
              }
              pinesNotifications.notify({ title: pTitle, text: rpta.message, type: pType, delay: 3000 });
            });

          };
          vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        }
      }); 
    };
    $scope.buscarPaciente = function (paciente) {
      var paramDatos = {
        search: paciente
      }
      PacienteServices.sListarPacientePorNombre(paramDatos).then(function (rpta) { 
      $scope.paciente = rpta.datos;
      $state.go('pacienteficha');
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
          console.log("datos login: ",response.datos);
          $scope.logIn();
          $scope.CargaMenu();
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
    $scope.CargaMenu = function() {
      var opciones = ['opDashboard','opProfesionales','opPacientes','opCitas','opEmpresas','opAlimentos','opEstadisticas','opInformes'];
      if($scope.fSessionCI.idgrupo == 1){
        $scope.valores = [true,true,true,true,true,true,true,true];
      }
      if($scope.fSessionCI.idgrupo == 2){
        $scope.valores = [true,false,true,true,true,true,true,true];
      }
      if($scope.fSessionCI.idgrupo == 3){
        $scope.valores = [true,false,true,true,false,false,false,false];
      }
    }
    $scope.changeViewConsulta = function(value, pestania, idatencion, origen){
      $scope.viewConsulta = value;
      $scope.pestaniaConsulta = pestania;
      $scope.idatencion = idatencion;
      $scope.origenConsulta = origen;
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
      //console.log('llego aqui', $scope.pacienteOrigen);
    }
    $scope.changeViewOnlyBodyCita(false);

    $scope.changeViewCita = function(value){
      $scope.viewCita = value;
    }
    $scope.changeViewCita(true);

    $scope.changeViewPaciente = function(value){
      $scope.viewPaciente = value;
    }
    $scope.changeViewPaciente(true);

    $scope.changeViewEnviaReporte = function(value){
      $scope.viewEnviaReporte = value;
    }
    $scope.changeViewEnviaReporte(false);

    $scope.changeViewSoloPlan = function(value,consulta){
      $scope.viewSoloPlan = value;
      $scope.consulta = consulta;
    }
    $scope.changeViewSoloPlan(false);
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
