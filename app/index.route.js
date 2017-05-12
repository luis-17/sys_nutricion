(function() {
  'use strict';

  angular
    .module('minotaur')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    //dashboard
      .state('dashboard', {
        url: '/app/dashboard',
        templateUrl: 'app/pages/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'dashboard'
      })
    //empresa
      .state('empresa', {
        url: '/app/empresa',
        templateUrl: 'app/pages/empresa/empresa.html',
        controller: 'EmpresaController',
        controllerAs: 'empresa'
      })
    //paciente
      .state('paciente', {
        url: '/app/paciente',
        templateUrl: 'app/pages/paciente/paciente.html',
        controller: 'PacienteController',
        controllerAs: 'paciente'
      })
    //mail
      .state('mail', {
        abstract: true,
        url: '/app/mail',
        controller: 'MailController',
        controllerAs: 'ctrl',
        templateUrl: 'app/pages/mail/mail.html'
      })
      //mail-inbox
      .state('mail.inbox', {
        url: '/inbox',
        templateUrl: 'app/pages/mail-inbox/mail-inbox.html',
        controller: 'MailInboxController',
        controllerAs: 'ctrl',
        parent: 'mail'
      })
      //mail-compose
      .state('mail.compose', {
        url: '/compose',
        templateUrl: 'app/pages/mail-compose/mail-compose.html',
        controller: 'MailComposeController',
        controllerAs: 'ctrl',
        parent: 'mail'
      })
      //mail-single
      .state('mail.single', {
        url: '/single',
        templateUrl: 'app/pages/mail-single/mail-single.html',
        controller: 'MailSingleController',
        controllerAs: 'ctrl',
        parent: 'mail'
      })

      //form stuff
      .state('forms', {
        url: '/app/forms',
        template: '<div ui-view></div>'
      })
      //common-elements
      .state('forms.common', {
        url: '/common',
        templateUrl: 'app/pages/forms-common/forms-common.html',
        controller: 'FormsCommonController',
        controllerAs: 'forms',
        parent: 'forms'
      })
      //validation-elements
      .state('forms.validation', {
        url: '/validation',
        templateUrl: 'app/pages/forms-validation/forms-validation.html',
        controller: 'FormsValidationController',
        controllerAs: 'forms',
        parent: 'forms'
      })
      //form-wizard
      .state('forms.wizard', {
        url: '/wizard',
        templateUrl: 'app/pages/forms-wizard/forms-wizard.html',
        controller: 'FormsWizardController',
        controllerAs: 'forms',
        parent: 'forms'
      })
      //upload
      .state('forms.upload', {
        url: '/upload',
        templateUrl: 'app/pages/forms-upload/forms-upload.html',
        controller: 'FormsUploadController',
        controllerAs: 'forms',
        parent: 'forms'
      })
      //imagecrop
      .state('forms.imagecrop', {
        url: '/imagecrop',
        templateUrl: 'app/pages/forms-imagecrop/forms-imagecrop.html',
        controller: 'FormsImageCropController',
        controllerAs: 'forms',
        parent: 'forms'
      })

      //ui
      .state('ui', {
        url: '/app/ui',
        template: '<div ui-view></div>'
      })
      //general-elements
      .state('ui.elements', {
        url: '/elements',
        templateUrl: 'app/pages/ui-elements/ui-elements.html',
        controller: 'UiElementsController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //buttons-icons
      .state('ui.buttons', {
        url: '/buttons',
        templateUrl: 'app/pages/ui-buttons/ui-buttons.html',
        controller: 'UiButtonsController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //typography
      .state('ui.typography', {
        url: '/typography',
        templateUrl: 'app/pages/ui-typography/ui-typography.html',
        controller: 'UiTypographyController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //navigation-accordions
      .state('ui.navs', {
        url: '/navs',
        templateUrl: 'app/pages/ui-navs/ui-navs.html',
        controller: 'UiNavigationsController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //modals
      .state('ui.modals', {
        url: '/modals',
        templateUrl: 'app/pages/ui-modals/ui-modals.html',
        controller: 'UiModalsController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //tiles
      .state('ui.tiles', {
        url: '/tiles',
        templateUrl: 'app/pages/ui-tiles/ui-tiles.html',
        controller: 'UiTilesController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //portlets
      .state('ui.portlets', {
        url: '/portlets',
        templateUrl: 'app/pages/ui-portlets/ui-portlets.html',
        controller: 'UiPortletsController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //grid
      .state('ui.grid', {
        url: '/grid',
        templateUrl: 'app/pages/ui-grid/ui-grid.html',
        controller: 'UiGridController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //widgets
      .state('ui.widgets', {
        url: '/widgets',
        templateUrl: 'app/pages/ui-widgets/ui-widgets.html',
        controller: 'UiWidgetsController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //tree
      .state('ui.tree', {
        url: '/tree',
        templateUrl: 'app/pages/ui-tree/ui-tree.html',
        controller: 'UiTreeController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //lists
      .state('ui.lists', {
        url: '/lists',
        templateUrl: 'app/pages/ui-lists/ui-lists.html',
        controller: 'UiListsController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //alerts
      .state('ui.alerts', {
        url: '/alerts',
        templateUrl: 'app/pages/ui-alerts/ui-alerts.html',
        controller: 'UiAlertsController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //masonry
      .state('ui.masonry', {
        url: '/masonry',
        templateUrl: 'app/pages/ui-masonry/ui-masonry.html',
        controller: 'UiMasonryController',
        controllerAs: 'ui',
        parent: 'ui'
      })
      //dragula
      .state('ui.dragula', {
        url: '/dragula',
        templateUrl: 'app/pages/ui-dragula/ui-dragula.html',
        controller: 'UiDragulaController',
        controllerAs: 'ui',
        parent: 'ui'
      })

      //shop
      .state('shop', {
        url: '/app/shop',
        template: '<div ui-view></div>'
      })
      //orders
      .state('shop.orders', {
        url: '/orders',
        templateUrl: 'app/pages/shop-orders/shop-orders.html',
        controller: 'ShopOrdersController',
        controllerAs: 'ctrl',
        parent: 'shop'
      })
      //single-order
      .state('shop.single-order', {
        url: '/single-order',
        templateUrl: 'app/pages/shop-single-order/shop-single-order.html',
        controller: 'ShopSingleOrderController',
        controllerAs: 'ctrl',
        parent: 'shop'
      })
      //products
      .state('shop.products', {
        url: '/products',
        templateUrl: 'app/pages/shop-products/shop-products.html',
        controller: 'ShopProductsController',
        controllerAs: 'ctrl',
        parent: 'shop'
      })
      //single-product
      .state('shop.single-product', {
        url: '/single-product',
        templateUrl: 'app/pages/shop-single-product/shop-single-product.html',
        controller: 'ShopSingleProductController',
        controllerAs: 'ctrl',
        parent: 'shop'
      })
      //invoices
      .state('shop.invoices', {
        url: '/invoices',
        templateUrl: 'app/pages/shop-invoices/shop-invoices.html',
        controller: 'ShopInvoicesController',
        controllerAs: 'ctrl',
        parent: 'shop'
      })
      //single-invoice
      .state('shop.single-invoice', {
        url: '/single-invoice',
        templateUrl: 'app/pages/shop-single-invoice/shop-single-invoice.html',
        controller: 'ShopSingleInvoiceController',
        controllerAs: 'ctrl',
        parent: 'shop'
      })

      //tables
      .state('tables', {
        url: '/app/tables',
        template: '<div ui-view></div>'
      })
      //bootstrap
      .state('tables.bootstrap', {
        url: '/bootstrap',
        templateUrl: 'app/pages/tables-bootstrap/tables-bootstrap.html',
        controller: 'TablesBootstrapController',
        controllerAs: 'ctrl',
        parent: 'tables'
      })
      //datatables
      .state('tables.datatables', {
        url: '/datatables',
        templateUrl: 'app/pages/tables-datatables/tables-datatables.html',
        controller: 'TablesDatatablesController',
        controllerAs: 'ctrl',
        parent: 'tables'
      })
      //ui-grid
      .state('tables.ui-grid', {
        url: '/ui-grid',
        templateUrl: 'app/pages/tables-ui-grid/tables-ui-grid.html',
        controller: 'TablesUiGridController',
        controllerAs: 'ctrl',
        parent: 'tables'
      })
      //ngTable
      .state('tables.ngtable', {
        url: '/ngtable',
        templateUrl: 'app/pages/tables-ngtable/tables-ngtable.html',
        controller: 'TablesNgTableController',
        controllerAs: 'ctrl',
        parent: 'tables'
      })
      //smartTable
      .state('tables.smart-table', {
        url: '/smart-table',
        templateUrl: 'app/pages/tables-smart-table/tables-smart-table.html',
        controller: 'TablesSmartTableController',
        controllerAs: 'ctrl',
        parent: 'tables'
      })
      //fooTable
      .state('tables.footable', {
        url: '/footable',
        templateUrl: 'app/pages/tables-footable/tables-footable.html',
        controller: 'TablesFooTableController',
        controllerAs: 'ctrl',
        parent: 'tables'
      })

      //app core pages (errors, login,signup)
      .state('pages', {
        url: '/app/pages',
        template: '<div ui-view></div>'
      })
      //login
      .state('pages.login', {
        url: '/login',
        templateUrl: 'app/pages/pages-login/pages-login.html',
        controller: 'LoginController',
        controllerAs: 'ctrl',
        parent: 'pages',
        specialClass: 'core'
      })
      //register
      .state('pages.signup', {
        url: '/signup',
        templateUrl: 'app/pages/pages-signup/pages-signup.html',
        controller: 'SignupController',
        controllerAs: 'ctrl',
        parent: 'pages',
        specialClass: 'core'
      })
      //forgotpass
      .state('pages.forgotpass', {
        url: '/forgotpass',
        templateUrl: 'app/pages/pages-forgotpass/pages-forgotpass.html',
        controller: 'ForgotPasswordController',
        controllerAs: 'ctrl',
        parent: 'pages',
        specialClass: 'core'
      })
      //404
      .state('pages.page404', {
        url: '/page404',
        templateUrl: 'app/pages/pages-404/pages-404.html',
        controller: 'Page404Controller',
        controllerAs: 'ctrl',
        parent: 'pages',
        specialClass: 'core'
      })
      //500
      .state('pages.page500', {
        url: '/page500',
        templateUrl: 'app/pages/pages-500/pages-500.html',
        controller: 'Page500Controller',
        controllerAs: 'ctrl',
        parent: 'pages',
        specialClass: 'core'
      })
      //offline
      .state('pages.offline', {
        url: '/page-offline',
        templateUrl: 'app/pages/pages-offline/pages-offline.html',
        controller: 'PageOfflineController',
        controllerAs: 'ctrl',
        parent: 'pages',
        specialClass: 'core'
      })
      //locked
      .state('pages.locked', {
        url: '/locked',
        templateUrl: 'app/pages/pages-locked/pages-locked.html',
        controller: 'LockedController',
        controllerAs: 'ctrl',
        parent: 'pages',
        specialClass: 'core'
      })
      //locked
      .state('pages.gallery', {
        url: '/gallery',
        templateUrl: 'app/pages/pages-gallery/pages-gallery.html',
        controller: 'PagesGalleryController',
        controllerAs: 'ctrl',
        parent: 'pages'
      })
      //timeline
      .state('pages.timeline', {
        url: '/timeline',
        templateUrl: 'app/pages/pages-timeline/pages-timeline.html',
        controller: 'PagesTimelineController',
        controllerAs: 'ctrl',
        parent: 'pages'
      })
      //chat
      .state('pages.chat', {
        url: '/chat',
        templateUrl: 'app/pages/pages-chat/pages-chat.html',
        controller: 'PagesChatController',
        controllerAs: 'ctrl',
        parent: 'pages'
      })
      //search-results
      .state('pages.search-results', {
        url: '/search-results',
        templateUrl: 'app/pages/pages-search-results/pages-search-results.html',
        controller: 'PagesSearchResultsController',
        controllerAs: 'ctrl',
        parent: 'pages'
      })
      //profile
      .state('pages.profile', {
        url: '/profile',
        templateUrl: 'app/pages/pages-profile/pages-profile.html',
        controller: 'PagesProfileController',
        controllerAs: 'ctrl',
        parent: 'pages'
      })
      //intro
      .state('pages.intro', {
        url: '/intro',
        templateUrl: 'app/pages/pages-intro/pages-intro.html',
        controller: 'PagesIntroController',
        controllerAs: 'ctrl',
        parent: 'pages'
      })

      //layouts
      .state('layouts', {
        url: '/app/layouts',
        template: '<div ui-view></div>'
      })
      //layout-boxed
      .state('layouts.boxed', {
        url: '/boxed',
        templateUrl: 'app/pages/layout-boxed/layout-boxed.html',
        controller: 'LayoutBoxedController',
        controllerAs: 'layout',
        parent: 'layouts',
        specialClass: 'boxed-layout'
      })
      //layout-base
      .state('layouts.base', {
        url: '/base',
        templateUrl: 'app/pages/layout-base/layout-base.html',
        controller: 'LayoutBaseController',
        controllerAs: 'layout',
        parent: 'layouts'
      })
      //layout-non-fixed-header
      .state('layouts.non-fixed-header', {
        url: '/non-fixed-header',
        templateUrl: 'app/pages/layout-non-fixed-header/layout-non-fixed-header.html',
        controller: 'LayoutNonFixedHeaderController',
        controllerAs: 'layout',
        parent: 'layouts',
        specialClass: 'header-aside'
      })
      //layout-non-fixed-sidebar
      .state('layouts.non-fixed-sidebar', {
        url: '/non-fixed-sidebar',
        templateUrl: 'app/pages/layout-non-fixed-sidebar/layout-non-fixed-sidebar.html',
        controller: 'LayoutNonFixedSidebarController',
        controllerAs: 'layout',
        parent: 'layouts',
        specialClass: 'sidebar-aside'
      })
      //layout-header-with-content
      .state('layouts.header-with-content', {
        url: '/header-with-content',
        templateUrl: 'app/pages/layout-header-with-content/layout-header-with-content.html',
        controller: 'LayoutHeaderWithContentController',
        controllerAs: 'layout',
        parent: 'layouts'
      })
      //layout-hz-menu
      .state('layouts.hz-menu', {
        url: '/hz-menu',
        templateUrl: 'app/pages/layout-hz-menu/layout-hz-menu.html',
        controller: 'LayoutHzMenuController',
        controllerAs: 'layout',
        parent: 'layouts',
        specialClass: 'hz-menu'
      })
      //layout-rtl
      .state('layouts.rtl', {
        url: '/rtl',
        templateUrl: 'app/pages/layout-rtl/layout-rtl.html',
        controller: 'LayoutRtlController',
        controllerAs: 'layout',
        parent: 'layouts',
        specialClass: 'rtl'
      })

      //maps
      .state('maps', {
        url: '/app/maps',
        template: '<div ui-view></div>'
      })
      //vector
      .state('maps.vector', {
        url: '/vector',
        templateUrl: 'app/pages/maps-vector/maps-vector.html',
        controller: 'MapsVectorController',
        controllerAs: 'ctrl',
        parent: 'maps'
      })
      //google
      .state('maps.google', {
        url: '/google',
        templateUrl: 'app/pages/maps-google/maps-google.html',
        controller: 'MapsGoogleController',
        controllerAs: 'ctrl',
        parent: 'maps'
      })
      //leaflet
      .state('maps.leaflet', {
        url: '/leaflet',
        templateUrl: 'app/pages/maps-leaflet/maps-leaflet.html',
        controller: 'MapsLeafletController',
        controllerAs: 'ctrl',
        parent: 'maps'
      })

      //calendar
      .state('calendar', {
        url: '/app/calendar',
        templateUrl: 'app/pages/calendar/calendar.html',
        controller: 'CalendarController',
        controllerAs: 'ctrl'
      })

      //charts
      .state('charts', {
        url: '/app/charts',
        templateUrl: 'app/pages/charts/charts.html',
        controller: 'ChartsController',
        controllerAs: 'ctrl'
      })

      //documentation
      .state('documentation', {
        url: '/app/documentation',
        templateUrl: 'app/pages/documentation/documentation.html',
        controller: 'DocumentationController',
        controllerAs: 'ctrl'
      });

    $urlRouterProvider.otherwise('/app/dashboard');
  }

})();
