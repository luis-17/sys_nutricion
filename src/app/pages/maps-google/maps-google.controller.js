(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('MapsGoogleController', MapsGoogleController)
    .controller('DrawingManagerController', DrawingManagerController)
    .controller('CircleSimpleMapController', CircleSimpleMapController);

  /** @ngInject */
  function MapsGoogleController() {


  }

  function DrawingManagerController($log) {
    var vm = this;
    vm.onMapOverlayCompleted = function(e){
      $log.log(e.type);
    };
  }

  function CircleSimpleMapController() {
    var vm = this;
    vm.cities = {
      chicago: {population:2714856, position: [41.878113, -87.629798]},
      newyork: {population:8405837, position: [40.714352, -74.005973]},
      losangeles: {population:3857799, position: [34.052234, -118.243684]},
      vancouver: {population:603502, position: [49.25, -123.1]}
    };
    vm.getRadius = function(num) {
      return Math.sqrt(num) * 100;
    };
  }

})();
