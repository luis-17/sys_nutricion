(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('MailComposeController', MailComposeController);

  /** @ngInject */
  function MailComposeController() {
    var vm = this;

    vm.availableRecipients = ['RLake@nec.gov','RBastian@lacus.io','VMonroe@orci.ly','YMckenzie@mattis.gov','VMcmyne@molestie.org','BKliban@aliquam.gov','HHellems@tincidunt.org','KAngell@sollicitudin.ly'];
  }
})();
