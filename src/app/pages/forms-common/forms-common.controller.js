(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('FormsCommonController', FormsCommonController)
    .controller('SlidersController', SlidersController)
    .controller('UiSelectController', UiSelectController)
    .controller('TagsInputController', TagsInputController);

  /** @ngInject */
  function FormsCommonController() {
    var vm = this;
    vm.htmlVariable = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li class="text-red">Super Easy <b>Theming</b> Options</li><li>Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li>Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';
  }

  function SlidersController() {
    var vm = this;

    vm.slider1 = {
      value: 36,
      options: {
        ceil: 50,
        showSelectionBar: true
      }
    };

    vm.verticalSlider1 = {
      value: 10,
      options: {
        floor: 0,
        ceil: 10,
        vertical: true
      }
    };
    vm.verticalSlider2 = {
      minValue: 20,
      maxValue: 80,
      options: {
        floor: 0,
        ceil: 100,
        vertical: true
      }
    };
    vm.verticalSlider3 = {
      value: 5,
      options: {
        floor: 0,
        ceil: 10,
        vertical: true,
        showTicks: true
      }
    };
    vm.verticalSlider4 = {
      minValue: 1,
      maxValue: 5,
      options: {
        floor: 0,
        ceil: 6,
        vertical: true,
        showTicksValues: true
      }
    };
    vm.verticalSlider5 = {
      value: 50,
      options: {
        floor: 0,
        ceil: 100,
        vertical: true,
        showSelectionBar: true
      }
    };
    vm.verticalSlider6 = {
      value: 6,
      options: {
        floor: 0,
        ceil: 6,
        vertical: true,
        showSelectionBar: true,
        showTicksValues: true,
        ticksValuesTooltip: function (v) {
          return 'Tooltip for ' + v;
        }
      }
    };

    vm.rangeSlider = {
      minValue: 1,
      maxValue: 8,
      options: {
        floor: 0,
        ceil: 10,
        showTicksValues: true
      }
    };

  }

  function UiSelectController() {
    var vm = this;

    vm.itemArray = [
      {id: 1, name: 'first'},
      {id: 2, name: 'second'},
      {id: 3, name: 'third'},
      {id: 4, name: 'fourth'},
      {id: 5, name: 'fifth'}
    ];

    vm.selected = { value: vm.itemArray[0] };

    vm.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];
    vm.multipleDemo = {};
    vm.multipleDemo.colors = ['Blue','Red'];
  }

  function TagsInputController($http) {
    var vm = this;

    vm.movies = [
      'The Dark Knight',
      'Heat',
      'Inception',
      'The Dark Knight Rises',
      'Kill Bill: Vol. 1',
      'Terminator 2: Judgment Day',
      'The Matrix',
      'Minority Report',
      'The Bourne Ultimatum'
    ];

    vm.loadMovies = function() {
      return $http.get('app/components/jsons/movies.json');
    };
  }
})();
