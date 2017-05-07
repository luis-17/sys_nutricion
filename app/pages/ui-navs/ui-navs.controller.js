(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('UiNavigationsController', UiNavigationsController)
    .controller('UiAccordionDemoController', UiAccordionDemoController)
    .controller('UiTabNavigationController', UiTabNavigationController);

  /** @ngInject */
  function UiNavigationsController() {

  }

  function UiAccordionDemoController($scope) {
    /* eslint-disable */
    $scope.oneAtATime = true;

    $scope.groups = [
      {
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
      },
      {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
      }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
      var newItemNo = $scope.items.length + 1;
      $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
      isCustomHeaderOpen: false,
      isFirstOpen: true,
      isFirstDisabled: false
    };
  }
  /* eslint-enable */

  function UiTabNavigationController($timeout, $window) {
    var vm = this;

    vm.tabs = [
      { title:'Dynamic Title 1', content:'Dynamic content 1' },
      { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];

    vm.alertMe = function() {
      $timeout(function() {
        $window.alert('You\'ve selected the alert tab!');
      });
    };

    vm.model = {
      name: 'Tabs'
    };
  }

})();
