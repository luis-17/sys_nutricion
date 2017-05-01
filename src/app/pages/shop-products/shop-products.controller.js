(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('ShopProductsController', ShopProductsController);

  /** @ngInject */
  function ShopProductsController(DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource) {

    var vm = this;
    vm.products = [];
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
      DTColumnDefBuilder.newColumnDef(7).notSortable()
    ];

    vm.selectedAll = false;

    vm.selectAll = function () {
      angular.forEach(vm.products, function(product) {
        product.selected = vm.selectedAll;
      });
    };

    $resource('http://www.filltext.com/?rows=300&id={index}&name={lorem|2}&category=["Food","Drinks","Accesories","Electro","Kitchen","Bathroom"]&price={numberLength|3}}&date={date|01-01-2012,01-01-2015}&status=["published","not published","deleted"]&pretty=true').query().$promise.then(function(products) {
      vm.products = products;
    });

    angular.element.fn.dataTable.ext.classes.sPageButton = 'btn btn-sm btn-default';

  }


})();
