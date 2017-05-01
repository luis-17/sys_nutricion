(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('ShopOrdersController', ShopOrdersController);

  /** @ngInject */
  function ShopOrdersController(DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource) {

    var vm = this;
    vm.orders = [];
    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withBootstrap()
      .withOption('order', [[1, 'asc']])
      .withDOM('<"row"<"col-md-8 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"pull-right"f>>>t<"row"<"col-md-4 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"inline-controls text-center"i>><"col-md-4 col-sm-12"p>>')
      .withLanguage({
        "sLengthMenu": 'View _MENU_ records',
        "sInfo":  'Found _TOTAL_ records',
        "oPaginate": {
          "sPage":    "Page",
          "sPageOf":  "of",
          "sFirst": "<i class='fa fa-angle-double-left'></i>",
          "sPrevious": "<i class='fa fa-angle-left'></i>",
          "sNext": "<i class='fa fa-angle-right'></i>",
          "sLast": "<i class='fa fa-angle-double-right'></i>"
        }
      })
      .withPaginationType('input')
      //.withScroller()
      //.withOption("sScrollY", false)
      //.withOption("sScrollX")
      .withColumnFilter();


    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0).notSortable(),
      DTColumnDefBuilder.newColumnDef(8).notSortable()
    ];

    vm.selectedAll = false;

    vm.selectAll = function () {
      angular.forEach(vm.orders, function(order) {
        order.selected = vm.selectedAll;
      });
    };

    $resource('http://www.filltext.com/?rows=300&id={index}&date={date|01-01-2012,01-01-2015}&placedby={firstName}~{lastName}&status=["pending","closed","sent","cancelled"]&quantity={number|20}&total={numberLength|3}}&shipto={streetAddress}~{city}&selected=false&pretty=true').query().$promise.then(function(orders) {
      vm.orders = orders;
    });

    angular.element.fn.dataTable.ext.classes.sPageButton = 'btn btn-sm btn-default';

  }


})();
