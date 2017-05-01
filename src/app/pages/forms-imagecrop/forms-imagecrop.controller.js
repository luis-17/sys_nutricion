(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('FormsImageCropController', FormsImageCropController);

  /** @ngInject */
  function FormsImageCropController($document, $scope) {
    var vm = this;
    vm.myImage='';
    vm.myCroppedImage='';
    vm.cropType='circle';

    var handleFileSelect=function(evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        /* eslint-disable */
        $scope.$apply(function(){
          vm.myImage=evt.target.result;
        });
        /* eslint-enable */
      };
      reader.readAsDataURL(file);
    };
    angular.element($document[0].querySelector('#fileInput')).on('change',handleFileSelect);
  }

})();
