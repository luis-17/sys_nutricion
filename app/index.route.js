(function() {
  'use strict';

  angular
    .module('minotaur')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      //dashboard
      .state('dashboard', {
        url: '/app/dashboard',
        templateUrl: 'app/pages/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'dashboard'
      })
      //app core pages (errors, login,signup)
      .state('pages', {
        url: '/app/pages',
        template: '<div ui-view></div>'
      })
      //login
      .state('pages.login', { 
        url: '/login',
        templateUrl: 'app/pages/pages-login/pages-login.html',
        controller: 'LoginController',
        controllerAs: 'ctrl',
        parent: 'pages',
        specialClass: 'core'
      })
      //empresa
      .state('empresa', {
        url: '/app/empresa',
        templateUrl: 'app/pages/empresa/empresa.html',
        controller: 'EmpresaController',
        controllerAs: 'empresa'
      })
      //paciente
      .state('paciente', {
        url: '/app/paciente',
        templateUrl: 'app/pages/paciente/paciente.html',
        controller: 'PacienteController',
        controllerAs: 'pac'
      })
      //citas
      .state('citas', {
        url: '/app/citas',
        templateUrl: 'app/pages/citas/citas.html',
        controller: 'CitasController as vm'
      })    
      //alimentos 
      .state('alimento', { 
        url: '/app/alimento',
        templateUrl: 'app/pages/alimento/alimento.html',
        controller: 'AlimentoController as vm'
      });

    $urlRouterProvider.otherwise('/app/dashboard');
  }

})();
