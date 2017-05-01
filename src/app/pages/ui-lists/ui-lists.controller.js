(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('UiListsController', UiListsController);

  /** @ngInject */
  function UiListsController($scope) {

    var vm = this;

    vm.list = [
      {
        id: 1,
        title: 'Item 1',
        items: []
      }, {
        id: 2,
        title: 'Item 2',
        items: [
          {
            id: 21,
            title: 'Item 2.1',
            items: [
              {
                id: 211,
                title: 'Item 2.1.1',
                items: []
              }, {
                id: 212,
                title: 'Item 2.1.2',
                items: []
              }
            ]
          }, {
            id: 22,
            title: 'Item 2.2',
            items: [
              {
                id: 221,
                title: 'Item 2.2.1',
                items: []
              }, {
                id: 222,
                title: 'Item 2.2.2',
                items: []
              }
            ]
          }
        ]
      }, {
        id: 3,
        title: 'Item 3',
        items: []
      }, {
        id: 4,
        title: 'Item 4',
        items: [
          {
            id: 41,
            title: 'Item 4.1',
            items: []
          }
        ]
      }, {
        id: 5,
        title: 'Item 5',
        items: []
      }, {
        id: 6,
        title: 'Item 6',
        items: []
      }, {
        id: 7,
        title: 'Item 7',
        items: []
      }
    ];

    vm.list2 = [
      {
        id: 1,
        title: 'Item 1',
        items: []
      }, {
        id: 2,
        title: 'Item 2',
        items: [
          {
            id: 21,
            title: 'Item 2.1',
            items: [
              {
                id: 211,
                title: 'Item 2.1.1',
                items: []
              }, {
                id: 212,
                title: 'Item 2.1.2',
                items: []
              }
            ]
          }, {
            id: 22,
            title: 'Item 2.2',
            items: [
              {
                id: 221,
                title: 'Item 2.2.1',
                items: []
              }, {
                id: 222,
                title: 'Item 2.2.2',
                items: []
              }
            ]
          }
        ]
      }, {
        id: 3,
        title: 'Item 3',
        items: []
      }, {
        id: 4,
        title: 'Item 4',
        items: [
          {
            id: 41,
            title: 'Item 4.1',
            items: []
          }
        ]
      }, {
        id: 5,
        title: 'Item 5',
        items: []
      }, {
        id: 6,
        title: 'Item 6',
        items: []
      }, {
        id: 7,
        title: 'Item 7',
        items: []
      }
    ];

    vm.selectedItem = {};

    vm.options = {};

    vm.remove = function(scope) {
      scope.remove();
    };

    vm.toggle = function(scope) {
      scope.toggle();
    };

    vm.newSubItem = function(scope) {
      var nodeData;
      nodeData = scope.$modelValue;
      nodeData.items.push({
        id: nodeData.id * 10 + nodeData.items.length,
        title: nodeData.title + '.' + (nodeData.items.length + 1),
        items: []
      });
    };

    /* eslint-disable */
    vm.collapseAll = function($event) {
      $scope.$broadcast('angular-ui-tree:collapse-all');
    };

    vm.expandAll = function($event) {
      $scope.$broadcast('angular-ui-tree:expand-all');
    };
    /* eslint-enable */

    vm.editItem = function(item) {
      if (item.editing) {
        item.editing = false;
      } else {
        item.editing = true;
        vm.itemCopy = angular.copy(item);
      }
    };

    vm.saveItem = function(item) {
      item.editing = false;
    };

    vm.cancelItem = function(item) {
      item.title = vm.itemCopy.title;
      item.editing = false;
    };

  }


})();
