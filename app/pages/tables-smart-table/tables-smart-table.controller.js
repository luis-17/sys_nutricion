(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('TablesSmartTableController', TablesSmartTableController)
    .controller('BasicSmartTableController', BasicSmartTableController)
    .controller('RowSelectSmartTableController', RowSelectSmartTableController)
    .controller('AjaxSmartTableController', AjaxSmartTableController);

  /** @ngInject */
  function TablesSmartTableController() {

  }

  function BasicSmartTableController() {
    var vm = this;
    var firstnames = ['Laurent', 'Blandine', 'Olivier', 'Max'];
    var lastnames = ['Renard', 'Faivre', 'Frere', 'Eponge'];
    var dates = ['1987-05-21', '1987-04-25', '1955-08-27', '1966-06-06'];
    var id = 1;

    function generateRandomItem(id) {

      var firstname = firstnames[Math.floor(Math.random() * 3)];
      var lastname = lastnames[Math.floor(Math.random() * 3)];
      var birthdate = dates[Math.floor(Math.random() * 3)];
      var balance = Math.floor(Math.random() * 2000);

      return {
        id: id,
        firstName: firstname,
        lastName: lastname,
        birthDate: new Date(birthdate),
        balance: balance
      }
    }

    vm.rowCollection = [];

    for (id; id < 5; id++) {
      vm.rowCollection.push(generateRandomItem(id));
    }

    //add to the real data holder
    vm.addRandomItem = function addRandomItem() {
      vm.rowCollection.push(generateRandomItem(id));
      id++;
    };

    //remove to the real data holder
    vm.removeItem = function removeItem(row) {
      var index = vm.rowCollection.indexOf(row);
      if (index !== -1) {
        vm.rowCollection.splice(index, 1);
      }
    };

    vm.predicates = ['firstName', 'lastName', 'birthDate', 'balance'];
    vm.selectedPredicate = vm.predicates[0];

  }

  function RowSelectSmartTableController() {
    var vm = this;

    var nameList = ['Pierre', 'Pol', 'Jacques', 'Robert', 'Elisa'],
      familyName = ['Dupont', 'Germain', 'Delcourt', 'bjip', 'Menez'],
      dates = ['1987-05-21', '1987-04-25', '1955-08-27', '1966-06-06'];

    function createRandomItem() {
      var
        firstName = nameList[Math.floor(Math.random() * 4)],
        lastName = familyName[Math.floor(Math.random() * 4)],
        birthdate = dates[Math.floor(Math.random() * 3)],
        email = firstName + lastName + '@whatever.com',
        balance = Math.random() * 3000;

      return{
        firstName: firstName,
        lastName: lastName,
        birthDate: birthdate,
        email: email,
        balance: balance
      };
    }

    vm.itemsByPage=15;

    vm.rowCollection = [];
    for (var j = 0; j < 200; j++) {
      vm.rowCollection.push(createRandomItem());
    }
  }

  function AjaxSmartTableController(smartTableResource) {
    var vm = this;

    vm.displayed = [];

    vm.callServer = function callServer(tableState) {

      vm.isLoading = true;

      var pagination = tableState.pagination;

      var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      var number = pagination.number || 10;  // Number of entries showed per page.

      smartTableResource.getPage(start, number, tableState).then(function (result) {
        vm.displayed = result.data;
        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
        vm.isLoading = false;
      });
    };
  }


})();
