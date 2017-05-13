(function() {
  'use strict';

  var directoryApp = 'sys_nutricion';
  // if (!window.location.origin) {
  //   window.location.origin = window.location.protocol+"//"+window.location.host;
  // }
  var dirWebRoot =  'http://localhost/'+directoryApp+'/';
  angular.patchURLCI = dirWebRoot+'ci.php/';

  // var handleError = function(response) {
  //   if ( ! angular.isObject( response.data ) || ! response.data.message ) {
  //       return( $q.reject( "An unknown error occurred." ) );
  //   }
  //   return( $q.reject( response.data.message ) );
  // }
  // var handleSuccess = function(response) {
  //   return( response.data );
  // }


  angular
    .module('minotaur')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $translateProvider, $locationProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    // angular-language
    $translateProvider.useStaticFilesLoader({
      prefix: 'assets/languages/',
      suffix: '.json'
    });
    $translateProvider.useLocalStorage();
    $translateProvider.preferredLanguage('es');
    $translateProvider.useSanitizeValueStrategy(null);

    // remove ! hash prefix
    $locationProvider.hashPrefix('');

  }

})();

function handleError( response ) {
      if ( ! angular.isObject( response.data ) || ! response.data.message ) {
          return( $q.reject( "An unknown error occurred." ) );
      }
      return( $q.reject( response.data.message ) );
  }
  function handleSuccess( response ) {
      return( response.data );
  }
