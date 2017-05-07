(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('UiAlertsController', UiAlertsController)
    .controller('AlertsApiController', AlertsApiController)
    .controller('ToastrApiController', ToastrApiController);

  /** @ngInject */
  function UiAlertsController() {


  }

  function AlertsApiController($timeout, $location, $anchorScroll) {
    var vm = this;

    vm.alerts = [];

    vm.alertOptions = {
      colors: [
        {name:'primary'},
        {name:'success'},
        {name:'warning'},
        {name:'danger'},
        {name:'info'},
        {name:'default'},
        {name:'cyan'},
        {name:'amethyst'},
        {name:'green'},
        {name:'orange'},
        {name:'red'},
        {name:'greensea'},
        {name:'dutch'},
        {name:'hotpink'},
        {name:'drank'},
        {name:'blue'},
        {name:'lightred'},
        {name:'slategray'},
        {name:'darkgray'},
        {name:'theme'}
      ],
      durations: [
        {name:'never close', value: 9999*9999},
        {name:'1 second', value: 1000},
        {name:'5 seconds', value: 5000},
        {name:'10 seconds', value: 10000}
      ],
      icons: [
        {name: 'none', value: ''},
        {name: 'warning', value: 'fa-warning'},
        {name: 'check', value: 'fa-check'},
        {name: 'user', value: 'fa-user'}
      ],
      msg: 'Place alert text here...'
    };

    vm.alertType = vm.alertOptions.colors[2]; // warning

    vm.alertDuration = vm.alertOptions.durations[0]; // never close

    vm.alertIcon = vm.alertOptions.icons[0]; // none

    vm.alertCloseable = true;

    vm.alertCloseAll = true;

    vm.alertFocus = true;

    vm.showAlert = function() {

      var alert = {
        msg: vm.alertOptions.msg,
        type: vm.alertType.name,
        timeout: vm.alertDuration.value,
        icon: vm.alertIcon.value,
        closeable: vm.alertCloseable,
        closeall: vm.alertCloseAll,
        focus: vm.alertFocus
      };

      if (alert.closeall) {
        vm.alerts = [];
      }

      if (alert.focus) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('alertsPlaceholder');

        // call $anchorScroll()
        $anchorScroll();
      }

      vm.alerts.push(alert);

      $timeout(function() {
        vm.alerts.splice(vm.alerts.indexOf(alert), 1);
      }, vm.alerts[vm.alerts.indexOf(alert)].timeout);

    };

    vm.closeAlert = function(index) {
      vm.alerts.splice(index, 1);
    };

  }

  function ToastrApiController(toastr, toastrConfig, $scope, $templateCache, $templateRequest) {
    var vm = this;

    var openedToasts = [];

    vm.toast = {
      colors: [
        {name:'primary'},
        {name:'success'},
        {name:'warning'},
        {name:'error'},
        {name:'info'},
        {name:'default'},
        {name:'cyan'},
        {name:'amethyst'},
        {name:'green'},
        {name:'orange'},
        {name:'red'},
        {name:'greensea'},
        {name:'dutch'},
        {name:'hotpink'},
        {name:'drank'},
        {name:'blue'},
        {name:'lightred'},
        {name:'slategray'},
        {name:'darkgray'},
        {name:'theme'}
      ],
      msg: 'Gnome & Growl type non-blocking notifications',
      title: 'This is toaster notification'
    };

    vm.options = {
      autoDismiss: false,
      position: 'toast-top-right',
      type: 'success',
      iconClass: vm.toast.colors[1],
      timeout: '5000',
      extendedTimeout: '1000',
      html: false,
      closeButton: false,
      tapToDismiss: true,
      progressBar: false,
      closeHtml: '<button>&times;</button>',
      newestOnTop: true,
      maxOpened: 0,
      preventDuplicates: false,
      preventOpenDuplicates: false
    };

    vm.refreshToast = function() {
      toastr.refreshTimer(openedToasts[openedToasts.length - 1]);
    };

    $scope.$watchCollection(function() {
      return vm.options;
    },function(newValue){
      toastrConfig.autoDismiss = newValue.autoDismiss;
      toastrConfig.allowHtml = newValue.html;
      toastrConfig.extendedTimeOut = parseInt(newValue.extendedTimeout, 10);
      toastrConfig.positionClass = newValue.position;
      toastrConfig.timeOut = parseInt(newValue.timeout, 10);
      toastrConfig.closeButton = newValue.closeButton;
      toastrConfig.tapToDismiss = newValue.tapToDismiss;
      toastrConfig.progressBar = newValue.progressBar;
      toastrConfig.closeHtml = newValue.closeHtml;
      toastrConfig.newestOnTop = newValue.newestOnTop;
      toastrConfig.maxOpened = newValue.maxOpened;
      toastrConfig.preventDuplicates = newValue.preventDuplicates;
      toastrConfig.preventOpenDuplicates = newValue.preventOpenDuplicates;
      if (newValue.customTemplate) {
        toastrConfig.templates.toast = 'custom';
      } else {
        toastrConfig.templates.toast = 'directives/toast/toast.html';
      }
    });

    $scope.$watch(function() {
      return vm.toast.customTemplate;
    }, function(newVal){
      if ($templateCache.get('custom')) {
        $templateCache.remove('custom');
      }
      $templateCache.put('custom', newVal);
    });

    vm.clearLastToast = function() {
      var toast = openedToasts.pop();
      toastr.clear(toast);
    };

    vm.clearToasts = function() {
      toastr.clear();
    };

    vm.openToast = function() {
      var toast = toastr[vm.options.type](vm.toast.msg, vm.toast.title, {
        iconClass: 'toast-'+vm.options.iconClass.name + ' ' + 'bg-'+vm.options.iconClass.name
      });
      openedToasts.push(toast);
    };

    $templateRequest('default.html').then(function(tpl) {
      vm.toast.customTemplate = tpl;
    });

  }


})();
