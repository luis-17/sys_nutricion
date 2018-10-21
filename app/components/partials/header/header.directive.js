(function() {
  'use strict';

  angular
    .module('minotaur')
    .directive('minotaurHeader', minotaurHeader);

  /** @ngInject */
  function minotaurHeader($window) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/partials/header/header.html',
      controller: HeaderController,
      controllerAs: 'header',
      bindToController: true,
      link: function (scope, element) {
        var app = angular.element('.appWrap'),
            $el = angular.element(element),
            w = angular.element($window);

        function setViewport(){
          if($window.innerWidth < 768){
            $el.addClass('viewport-sm');
            app.addClass('viewport-sm');
          } else {
            $el.removeClass('viewport-sm');
            app.removeClass('viewport-sm');
          }
        }

        setViewport();

        w.bind('resize', setViewport);
      }
    };

    return directive;

    /** @ngInject */
    function HeaderController() {
      var vm = this; 
    }
  }

})();
