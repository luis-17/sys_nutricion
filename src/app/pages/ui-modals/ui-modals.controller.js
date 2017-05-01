(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('UiModalsController', UiModalsController)
    .controller('ModalInstanceController', ModalInstanceController)
    .controller('SplashModalsController', SplashModalsController);

  /** @ngInject */
  function UiModalsController($uibModal, $log) {
    var vm = this;

    vm.items = ['item1', 'item2', 'item3'];

    vm.animationsEnabled = true;

    vm.open = function (size) {

      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceController',
        controllerAs: 'modal',
        size: size,
        resolve: {
          items: function () {
            return vm.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        vm.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    vm.toggleAnimation = function () {
      vm.animationsEnabled = !vm.animationsEnabled;
    };
  }

  function ModalInstanceController($uibModalInstance, items) {
    var vm = this;

    vm.items = items;
    vm.selected = {
      item: vm.items[0]
    };

    vm.ok = function () {
      $uibModalInstance.close(vm.selected.item);
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }

  function SplashModalsController($uibModal, $log) {
    var vm = this;

    vm.items = ['item1', 'item2', 'item3'];

    vm.openSplash = function(event, size) {

      var options = angular.element(event.target).data('options');

      var modalInstance = $uibModal.open({
        templateUrl: 'mySplashContent.html',
        controller: 'ModalInstanceController',
        controllerAs: 'modal',
        size: size,
        backdropClass: 'splash' + ' ' + options,
        windowClass: 'splash' + ' ' + options,
        resolve: {
          items: function () {
            return vm.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        vm.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }

})();
