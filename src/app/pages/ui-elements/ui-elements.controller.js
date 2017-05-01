(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('UiElementsController', UiElementsController)
    .controller('ProgressController', ProgressController)
    .controller('CarouselController', CarouselController)
    .controller('CollapseController', CollapseController)
    .controller('DropdownController', DropdownController)
    .controller('DatepickerController', DatepickerController)
    .controller('DatepickerPopupController', DatepickerPopupController)
    .controller('PopoverController', PopoverController)
    .controller('RatingsController', RatingsController)
    .controller('ButtonsController', ButtonsController)
    .controller('TooltipController', TooltipController)
    .controller('TypeaheadController', TypeaheadController)
    .controller('TimepickerController', TimepickerController)
    .controller('PaginationController', PaginationController)
    .controller('PagerController', PagerController);

  /** @ngInject */
  function UiElementsController() {

  }

  function ProgressController() {
    var vm = this;

    vm.max = 200;

    vm.random = function() {
      var value = Math.floor(Math.random() * 100 + 1);
      var type;

      if (value < 25) {
        type = 'success';
      } else if (value < 50) {
        type = 'info';
      } else if (value < 75) {
        type = 'warning';
      } else {
        type = 'danger';
      }

      vm.showWarning = type === 'danger' || type === 'warning';

      vm.dynamic = value;
      vm.type = type;
    };

    vm.random();

    vm.randomStacked = function() {
      vm.stacked = [];
      var types = ['success', 'info', 'warning', 'danger'];

      for (var i = 0, n = Math.floor(Math.random() * 4 + 1); i < n; i++) {
        var index = Math.floor(Math.random() * 4);
        vm.stacked.push({
          value: Math.floor(Math.random() * 30 + 1),
          type: types[index]
        });
      }
    };

    vm.randomStacked();
  }

  function CarouselController() {
    var vm = this;
    vm.myInterval = 5000;
    vm.noWrapSlides = false;
    vm.active = 0;
    var slides = vm.slides = [];
    var currIndex = 0;

    vm.addSlide = function() {
      var newWidth = 900 + slides.length + 1;
      slides.push({
        image: '//placekitten.com/' + newWidth + '/300',
        text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' + ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4],
        id: currIndex++
      });
    };

    vm.randomize = function() {
      var indexes = generateIndexesArray();
      assignNewIndexesToSlides(indexes);
    };

    for (var i = 0; i < 4; i++) {
      vm.addSlide();
    }

    // Randomize logic below

    function assignNewIndexesToSlides(indexes) {
      for (var i = 0, l = slides.length; i < l; i++) {
        slides[i].id = indexes.pop();
      }
    }

    function generateIndexesArray() {
      var indexes = [];
      for (var i = 0; i < currIndex; ++i) {
        indexes[i] = i;
      }
      return shuffle(indexes);
    }

    // http://stackoverflow.com/questions/962802#962890
    function shuffle(array) {
      var tmp, current, top = array.length;

      if (top) {
        while (--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = array[current];
          array[current] = array[top];
          array[top] = tmp;
        }
      }

      return array;
    }
  }

  function CollapseController(){
    var vm = this;
    vm.isCollapsed = false;
    vm.isCollapsedHorizontal = false;
  }

  function DropdownController($log, $document){
    var vm = this;

    vm.items = [
      'The first choice!',
      'And another choice for you.',
      'but wait! A third!'
    ];

    vm.status = {
      isopen: false
    };

    vm.toggled = function(open) {
      $log.log('Dropdown is now: ', open);
    };

    vm.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.status.isopen = !vm.status.isopen;
    };

    vm.appendToEl = angular.element($document[0].querySelector('#dropdown-long-content'));
  }

  function DatepickerController(){
    var vm = this;

    vm.today = function() {
      vm.dt = new Date();
    };
    vm.today();

    vm.clear = function() {
      vm.dt = null;
    };

    vm.options = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    vm.toggleMin = function() {
      vm.options.minDate = vm.options.minDate ? null : new Date();
    };

    vm.toggleMin();

    vm.setDate = function(year, month, day) {
      vm.dt = new Date(year, month, day);
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date(tomorrow);
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    vm.events = [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0,0,0,0);

        for (var i = 0; i < vm.events.length; i++) {
          var currentDay = new Date(vm.events[i].date).setHours(0,0,0,0);

          if (dayToCheck === currentDay) {
            return vm.events[i].status;
          }
        }
      }

      return '';
    }
  }

  function DatepickerPopupController(){
    var vm = this;

    vm.today = function() {
      vm.dt = new Date();
    };
    vm.today();

    vm.clear = function() {
      vm.dt = null;
    };

    vm.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    vm.dateOptions = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    vm.toggleMin = function() {
      vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
      vm.dateOptions.minDate = vm.inlineOptions.minDate;
    };

    vm.toggleMin();

    vm.open1 = function() {
      vm.popup1.opened = true;
    };

    vm.open2 = function() {
      vm.popup2.opened = true;
    };

    vm.setDate = function(year, month, day) {
      vm.dt = new Date(year, month, day);
    };

    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.altInputFormats = ['M!/d!/yyyy'];

    vm.popup1 = {
      opened: false
    };

    vm.popup2 = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    vm.events = [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0,0,0,0);

        for (var i = 0; i < vm.events.length; i++) {
          var currentDay = new Date(vm.events[i].date).setHours(0,0,0,0);

          if (dayToCheck === currentDay) {
            return vm.events[i].status;
          }
        }
      }

      return '';
    }
  }

  function PopoverController($sce){
    var vm = this;

    vm.dynamicPopover = {
      content: 'Hello, World!',
      templateUrl: 'myPopoverTemplate.html',
      title: 'Title'
    };

    vm.placement = {
      options: [
        'top',
        'top-left',
        'top-right',
        'bottom',
        'bottom-left',
        'bottom-right',
        'left',
        'left-top',
        'left-bottom',
        'right',
        'right-top',
        'right-bottom'
      ],
      selected: 'top'
    };

    vm.htmlPopover = $sce.trustAsHtml('<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content');
  }

  function RatingsController(){
    var vm = this;

    vm.rate = 7;
    vm.max = 10;
    vm.isReadonly = false;

    vm.hoveringOver = function(value) {
      vm.overStar = value;
      vm.percent = 100 * (value / vm.max);
    };

    vm.ratingStates = [
      {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
      {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
      {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
      {stateOn: 'glyphicon-heart'},
      {stateOff: 'glyphicon-off'}
    ];
  }

  function ButtonsController($scope){
    /* eslint-disable */
    $scope.singleModel = 1;

    $scope.radioModel = 'Middle';

    $scope.checkModel = {
      left: false,
      middle: true,
      right: false
    };

    $scope.checkResults = [];

    $scope.$watchCollection('checkModel', function () {
      $scope.checkResults = [];
      angular.forEach($scope.checkModel, function (value, key) {
        if (value) {
          $scope.checkResults.push(key);
        }
      });
    });
    /* eslint-enable */
  }

  function TooltipController($sce){
    var vm = this;

    vm.dynamicTooltip = 'Hello, World!';
    vm.dynamicTooltipText = 'dynamic';
    vm.htmlTooltip = $sce.trustAsHtml('I\'ve been made <b>bold</b>!');
    vm.placement = {
      options: [
        'top',
        'top-left',
        'top-right',
        'bottom',
        'bottom-left',
        'bottom-right',
        'left',
        'left-top',
        'left-bottom',
        'right',
        'right-top',
        'right-bottom'
      ],
      selected: 'top'
    };
  }

  function TypeaheadController($http){
    var vm = this;

    var _selected;

    vm.selected = undefined;
    vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    // Any function returning a promise object can be used to load values asynchronously
    vm.getLocation = function(val) {
      return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: val,
          sensor: false
        }
      }).then(function(response){
        return response.data.results.map(function(item){
          return item.formatted_address;
        });
      });
    };

    vm.ngModelOptionsSelected = function(value) {
      if (arguments.length) {
        _selected = value;
      } else {
        return _selected;
      }
    };

    vm.modelOptions = {
      debounce: {
        default: 500,
        blur: 250
      },
      getterSetter: true
    };

    vm.statesWithFlags = [{'name':'Alabama','flag':'5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},{'name':'Alaska','flag':'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},{'name':'Arizona','flag':'9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},{'name':'Arkansas','flag':'9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},{'name':'California','flag':'0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},{'name':'Colorado','flag':'4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},{'name':'Connecticut','flag':'9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},{'name':'Delaware','flag':'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},{'name':'Florida','flag':'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},{'name':'Georgia','flag':'5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'},{'name':'Hawaii','flag':'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},{'name':'Idaho','flag':'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},{'name':'Illinois','flag':'0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},{'name':'Indiana','flag':'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},{'name':'Iowa','flag':'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},{'name':'Kansas','flag':'d/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},{'name':'Kentucky','flag':'8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},{'name':'Louisiana','flag':'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},{'name':'Maine','flag':'3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},{'name':'Maryland','flag':'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},{'name':'Massachusetts','flag':'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},{'name':'Michigan','flag':'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},{'name':'Minnesota','flag':'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},{'name':'Mississippi','flag':'4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},{'name':'Missouri','flag':'5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},{'name':'Montana','flag':'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},{'name':'Nebraska','flag':'4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},{'name':'Nevada','flag':'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},{'name':'New Hampshire','flag':'2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},{'name':'New Jersey','flag':'9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},{'name':'New Mexico','flag':'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},{'name':'New York','flag':'1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},{'name':'North Carolina','flag':'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},{'name':'North Dakota','flag':'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},{'name':'Ohio','flag':'4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},{'name':'Oklahoma','flag':'6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},{'name':'Oregon','flag':'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},{'name':'Pennsylvania','flag':'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},{'name':'Rhode Island','flag':'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},{'name':'South Carolina','flag':'6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},{'name':'South Dakota','flag':'1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},{'name':'Tennessee','flag':'9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},{'name':'Texas','flag':'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},{'name':'Utah','flag':'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},{'name':'Vermont','flag':'4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},{'name':'Virginia','flag':'4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},{'name':'Washington','flag':'5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},{'name':'West Virginia','flag':'2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},{'name':'Wisconsin','flag':'2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},{'name':'Wyoming','flag':'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}];
  }

  function TimepickerController($log) {
    var vm = this;

    vm.mytime = new Date();

    vm.hstep = 1;
    vm.mstep = 15;

    vm.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    vm.ismeridian = true;
    vm.toggleMode = function() {
      vm.ismeridian = ! vm.ismeridian;
    };

    vm.update = function() {
      var d = new Date();
      d.setHours( 14 );
      d.setMinutes( 0 );
      vm.mytime = d;
    };

    vm.changed = function () {
      $log.log('Time changed to: ' + vm.mytime);
    };

    vm.clear = function() {
      vm.mytime = null;
    };
  }

  function PaginationController($log){
    var vm = this;

    vm.totalItems = 64;
    vm.currentPage = 4;

    vm.setPage = function (pageNo) {
      vm.currentPage = pageNo;
    };

    vm.pageChanged = function() {
      $log.log('Page changed to: ' + vm.currentPage);
    };

    vm.maxSize = 5;
    vm.bigTotalItems = 175;
    vm.bigCurrentPage = 1;
  }

  function PagerController(){
    var vm = this;

    vm.totalItems = 64;
    vm.currentPage = 4;
  }

})();
