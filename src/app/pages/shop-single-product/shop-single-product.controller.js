(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('ShopSingleProductController', ShopSingleProductController);

  /** @ngInject */
  function ShopSingleProductController() {
    var vm = this;

    vm.price = 2.80;
    vm.discount = 8;
    vm.numberVar1 = 1;
    vm.numberVar2 = 2;
    vm.numberVar3 = 3;
  }


})();
