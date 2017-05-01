(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('FormsWizardController', FormsWizardController);

  /** @ngInject */
  function FormsWizardController($log) {
    var vm = this;
    vm.activeStep = 0;
    vm.user = {};

    vm.submit = function(){
      $log.log(vm.user);
    }
  }

})();
