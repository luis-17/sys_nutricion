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
            Highcharts.chart(element[0], scope.options); 
          }
      };
    })
    // Directive for pie charts, pass in title and data only    
    .directive('hcPieChart', function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                title: '@',
                data: '='
            },
            link: function (scope, element) {
                Highcharts.chart(element[0], {
                    chart: {
                        type: 'pie',
                        events: {
                          load: function () { 

                          }
                        }
                    },
                    title: {
                        text: scope.title
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        data: scope.data
                    }]
                });
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
    .factory("handle", function(alertify,$state){ 
      var handle = {
        error: function (error) {
                      return function () {
                        return {success: false, message: Notification.warning({message: error})};
                      };
        },
        success: function (response) {
            //console.log('response.data',response.data);
            if(response.data.flag == 'session_expired'){ 
              alertify.okBtn("CLICK AQUI")
                      .cancelBtn("Cerrar")
                      .confirm(response.data.message, 
                        function (ev) {                      
                          //var dir = window.location.href.split('app')[0];
                          //window.location.href = dir + 'app/pages/login';
                          var url = $state.href('pages.login'); 
                          window.open(url,'_self'); 
                          $('.alertify').remove();
                        }
                      );
            }
            if(response.data.flag == 'pay_expired'){ 
              alertify.okBtn("CLICK AQUI") 
                      .cancelBtn("Cerrar") 
                      .confirm(response.data.message, 
                        function (ev) { 
                          var url = $state.href('pages.login'); 
                          window.open(url,'_self'); 
                          $('.alertify').remove();
                          // var dir = window.location.href.split('app')[0];
                          // window.location.href = dir + 'app/pages/login';
                        }
                      );
            }
            return( response.data );
        }
      }
      return handle;
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
  function MainController($translate, $scope, $timeout, $state, rootServices, $uibModal,PacienteServices,UsuarioServices,$location,pinesNotifications) {
    var vm = this; 
    
    $scope.metodos = {}; 
    $scope.fArr = {};
    $scope.fArr.boolAutoStart = false;
    $scope.iniciarTour = function() { 
      $scope.fArr.boolAutoStart = true;
    }
    $scope.fArr.arrSteps = [];
    $scope.fArr.valores = [];
    var arrSteps = [
        {
          cod_permiso: null,
          element: 'minotaur-header .navbar-header',
          intro: '<h2 class="header">El logo de su marca</h2> <p>Visualizaras tu logo desde aquí.</p>', 
        },
        {
          cod_permiso: null,
          element: 'minotaur-header .main-search',
          intro: '<h2 class="header">Buscador de pacientes</h2> <p>Busque a sus pacientes rapidamente. <br /> Desde cualquier opción siempre tendrá este cuadro visible.</p>'
        },
        {
          cod_permiso: null,
          element: 'minotaur-header button.navigation-toggle',
          intro: '<h2 class="header">Desglosar el menú</h2> <p>Oculta o muestra el menú para mas comodidad de trabajo.</p>'
        },
        {
          cod_permiso: null,
          element: 'minotaur-header #profile',
          intro: '<h2 class="header">Tu perfil</h2> <p>Aquí va tu foto de perfil y tu configuración de la cuenta.</p>'
        },
        {
          cod_permiso: 1,
          element: 'minotaur-nav .nav li.dashboard',
          intro: '<h2 class="header">Dashboard</h2> <p> Consulta tus próximas citas, visualiza consolidados e ingresa a las funcionalidades desde los accesos directos. </p>',
          position: 'right'
        },
        {
          cod_permiso: 2,
          element: 'minotaur-nav .nav li.profesional',
          intro: '<h2 class="header">Profesionales</h2> <p> ¿Manejas un Centro Nutricionista? Gestiona a los profesionales que están a tu cargo. </p>',
          position: 'right'
        },
        {
          cod_permiso: 3,
          element: 'minotaur-nav .nav li.paciente',
          intro: '<h2 class="header">Pacientes</h2> <p> Gestiona a tus pacientes, revisa su historia clínica, compara sus atenciones, consulta su plan alimentario y mucho más. </p>',
          position: 'right'
        },
        {
          cod_permiso: 4,
          element: 'minotaur-nav .nav li.citas',
          intro: '<h2 class="header">Citas</h2> <p> - Gestiona tus citas desde nuestro potente calendario de reservas. Arrastra y suelta; es super sencillo. <br/> - Registre atenciones y genera fichas personalizados para cada usuario. <br/> - Genere las hojas de dieta del paciente </p>',
          position: 'right'
        },
        {
          cod_permiso: 5,
          element: 'minotaur-nav .nav li.empresa',
          intro: '<h2 class="header">Clientes Corporativos</h2> <p> ¿Das tu servicio a clientes corporativos? Agrupa a tus pacientes por empresa y gestiona a tus clientes corporativos. </p>',
          position: 'right'
        },
        {
          cod_permiso: 6,
          element: 'minotaur-nav .nav li.alimento',
          intro: '<h2 class="header">Alimentos</h2> <p> Gestiona tu propia base de datos de alimentos con sus valores nutricionales. No te preocupes, tenemos gran cantidad de alimentos precargados para tí. </p>',
          position: 'right'
        },
        {
          cod_permiso: 7,
          element: 'minotaur-nav .nav li.informe-empresarial',
          intro: '<h2 class="header">Informe Empresarial</h2> <p> Entrega resultados. Genera reportes consolidados y gráficos estadísticos por cliente corporativo </p>',
          position: 'right'
        },
        {
          cod_permiso: null,
          element: 'minotaur-nav .contacto',
          intro: '<h2 class="header">¡Contáctanos!</h2> <p> ¿Necesitas ayuda? Te brindamos soporte los 365 días del año, por nuestros canales de contacto. </p>',
          position: 'right'
        },
        {
          cod_permiso: null,
          element: 'minotaur-nav .disfruta_de_la_plataforma',
          intro: '<h2 class="header">¡Disfruta!</h2> <p> <b>¡FIN!</b> <br/> Esta plataforma ha sido hecha con mucho cariño, y estará actualizándose constantemente con nuevas funcionalidades para tí: Profesional de la Salud. :) </p>',
          position: 'right'
        }
    ]; 
    $scope.CargaMenu = function() { 
      var opciones = ['opDashboard','opProfesionales','opPacientes','opCitas','opEmpresas','opAlimentos','opInformes']; 
      $scope.fArr.arrSteps = [];
      if($scope.fSessionCI.idgrupo == 1){
        $scope.fArr.valores = [true,true,true,true,true,true,true];
      }
      if($scope.fSessionCI.idgrupo == 2){
        $scope.fArr.valores = [true,false,true,true,true,true,true];
      }
      if($scope.fSessionCI.idgrupo == 3){
        $scope.fArr.valores = [true,false,true,true,false,true,false];
      }
      var cont = 0;
      //console.log(arrSteps,'arrSteps');
      angular.forEach(arrSteps,function(val,index) { 
        if(val.cod_permiso){ 
          if( $scope.fArr.valores[cont] === true ){ 
            $scope.fArr.arrSteps.push(val);
          }
          cont++; 
        }else{
          $scope.fArr.arrSteps.push(val);
        }
      }); 
      var result = [];
      angular.forEach($scope.fArr.arrSteps,function(val,index) { 
        if(val){ 
          result.push(val);
        } 
      }); 
      //$scope.fArr.arrSteps = result; 
      vm.introOptions.steps = result;
      console.log($scope.fArr.arrSteps,'$scope.fArr.arrSteps');
      console.log(vm.introOptions.steps,'vm.introOptions.steps');
    } 
    $scope.getValidateSession = function () {
      rootServices.sGetSessionCI().then(function (response) {
        //console.log(response);
        if(response.flag == 1){
          $scope.fSessionCI = response.datos; 
          $scope.fArr.boolAutoStart = ($scope.fSessionCI.mostrar_intro == 1) ? true : false; 
          $scope.logIn();
          $scope.CargaMenu();
          if( $location.path() == '/app/pages/login' ){
            $scope.goToUrl('/');
          }
          if( $scope.fArr.boolAutoStart ){ 
            $timeout(function() { 
              $scope.iniciarTour(); 
            },5000); 
          }
        }else{
          $scope.fSessionCI = {};
          $scope.logOut();
          $scope.goToUrl('/app/pages/login');
        }
      });
    }
    $scope.getValidateSession();
    
    vm.introOptions = { 
      overlayOpacity: 0.3,
      showBullets: true,
      showStepNumbers: false,
      nextLabel: 'Siguiente <i class="fa fa-chevron-right"></i>',
      prevLabel: '<i class="fa fa-chevron-left"></i> Atrás',
      skipLabel: '<i class="fa fa-close"></i>',
      doneLabel: '<i class="fa fa-close"></i>',
      steps: $scope.fArr.arrSteps 
    };
    
    vm.changeLanguage = function (langKey) {
      $translate.use(langKey);
      vm.currentLanguage = langKey;
    };
    vm.onChangeStep = function(obj,scope) { 
      if($(obj).hasClass('contacto')){ 
        // actualizar valor de intro 
        UsuarioServices.sActualizarIntroNoMostrar();
      }
    } 
    vm.onChangeExit = function() { 
      // actualizar valor de intro 
      UsuarioServices.sActualizarIntroNoMostrar();
    }
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
        // $scope.fArr.arrSteps = [];
        // $scope.fArr.valores = [];
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
        if( rpta.flag == 1 ){
          $scope.paciente = rpta.datos;
          $state.go('pacienteficha'); 
          if( !(angular.isUndefined($scope.metodos.btnVerFicha)) ){ 
            $scope.metodos.btnVerFicha($scope.paciente);
            $scope.fArr.fBusqueda = rpta.datos.paciente;
          } 
        }else{
          pinesNotifications.notify({ title: 'Advertencia', text: 'No se encontró al paciente.', type: 'warning', delay: 3000 });          
        }
        
      });
    };
    
    $scope.goToUrl = function ( path , searchParam) {
      $location.path( path );
      if(searchParam){ 
        $location.search({param: searchParam});
      }
    };
    
    
    $scope.tipoDieta = null;
    $scope.idatencion = null;
    $scope.changeViewConsulta = function(value, pestania, idatencion, origen, tipoDieta){
      $scope.viewConsulta = value;
      $scope.pestaniaConsulta = pestania || null;
      $scope.idatencion = idatencion || null;
      $scope.tipoDieta = tipoDieta || null;
      $scope.origenConsulta = origen || null;
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

    console.log($scope.metodos,'$scope.metodos, index.controllerjs');
  }
  function rootServices($http, $q, handle) {
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
      return (request.then( handle.success,handle.error ));
    }
    function sGetSessionCI(pDatos) {
      var datos = pDatos || {};
      var request = $http({
            method : "post",
            url :  angular.patchURLCI + "Acceso/getSessionCI",
            data : datos
      });
      return (request.then( handle.success,handle.error ));
    }
  }
})();
