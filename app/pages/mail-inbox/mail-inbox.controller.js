(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('MailInboxController', MailInboxController);

  /** @ngInject */
  function MailInboxController($resource) {
    var vm = this;
    vm.mails = $resource('app/components/jsons/mails.json').query();

    vm.selectedAll = false;

    vm.selectAll = function () {

      if (vm.selectedAll) {
        vm.selectedAll = false;
      } else {
        vm.selectedAll = true;
      }

      angular.forEach(vm.mails, function(mail) {
        mail.selected = vm.selectedAll;
      });
    };
  }
})();
