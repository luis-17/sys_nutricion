(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('FormsValidationController', FormsValidationController);

  /** @ngInject */
  function FormsValidationController($log) {
    var vm = this;

    // function to submit the form after all validation has occurred
    vm.submitForm = function(isValid) {
      $log.log('validate form');

      // check to make sure the form is completely valid
      if (isValid) {
        $log.log('our form is amazing');
      } else {
        $log.log('form is invalid');
      }

    };

    vm.dateFormatOption = {
      parser: function (viewValue) {
        return viewValue ? new Date(viewValue) : undefined;
      },
      formatter: function (modelValue) {
        if (!modelValue) {
          return "";
        }
        var date = new Date(modelValue);
        return (date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()).replace(/\b(\d)\b/g, "0$1");
      },
      isEmpty: function (modelValue) {
        return !modelValue;
      }
    };
  }

})();
