(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($translate) {
    var vm = this;
    // console.log('$translate',$translate); 
    vm.changeLanguage = function (langKey) { 
      // console.log('langKey',langKey);langKey
      $translate.use(langKey);
      vm.currentLanguage = langKey;
    };
    //vm.currentLanguage = $translate.proposedLanguage() || $translate.use();
    vm.changeLanguage('es');
  }
})();
