(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('FormsUploadController', FormsUploadController);

  /** @ngInject */
  function FormsUploadController($log, FileUploader) {
    var vm = this;
    var uploader = vm.uploader = new FileUploader({
      //url: 'app/components/modules/fileupload/upload.php' //enable this option to get f
    });

    // FILTERS

    uploader.filters.push({
      name: 'customFilter',
      fn: function() {
        var vm = this;
        return vm.queue.length < 10;
      }
    });

    uploader.filters.push({
      name: 'imageFilter',
      fn: function(item /*{File|FileLikeObject}, options*/) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      $log.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
      $log.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
      $log.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
      $log.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
      $log.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
      $log.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      $log.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      $log.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
      $log.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
      $log.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
      $log.info('onCompleteAll');
    };

    $log.info('uploader', uploader);
  }

})();
