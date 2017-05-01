(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('UiMasonryController', UiMasonryController);

  /** @ngInject */
  function UiMasonryController(ipsumService) {
    var vm = this;

    function genBrick() {
      var height = ~~(Math.random() * 500) + 100;
      var id = ~~(Math.random() * 10000);
      return {
        src: 'http://lorempixel.com/g/720/' + height + '/?' + id,
        title: ipsumService.randomMi()+ipsumService.words(1)+' '+ipsumService.randomMi()+ipsumService.words(1),
        content: ipsumService.sentences(2)
      };
    }

    vm.bricks = [
      genBrick(),
      genBrick(),
      genBrick(),
      genBrick(),
      genBrick(),
      genBrick(),
      genBrick(),
      genBrick(),
      genBrick(),
      genBrick()
    ];

  }


})();
