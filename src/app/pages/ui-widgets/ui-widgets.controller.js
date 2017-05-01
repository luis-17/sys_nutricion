(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('UiWidgetsController', UiWidgetsController)
    .controller('TodoWidgetController', TodoWidgetController)
    .controller('CalendarWidgetController', CalendarWidgetController)
    .controller('MessageController', MessageController)
    .controller('AppointmentsController', AppointmentsController);

  /** @ngInject */
  function UiWidgetsController() {

  }

  function TodoWidgetController(){
    var vm = this;

    vm.todos = [{
      text: 'Release update',
      completed: false
    },{
      text: 'Make a backup',
      completed: false
    },{
      text: 'Send e-mail to Ici',
      completed: true
    },{
      text: 'Buy tickets',
      completed: false
    },{
      text: 'Resolve issues',
      completed: false
    },{
      text: 'Compile new version',
      completed: false
    }];

    var todos = vm.todos;

    vm.addTodo = function() {
      vm.todos.push({
        text: vm.todo,
        completed: false
      });
      vm.todo = '';
    };

    vm.removeTodo = function(todo) {
      todos.splice(todos.indexOf(todo), 1);
    };

    vm.editTodo = function(todo) {
      vm.editedTodo = todo;
      // Clone the original todo to restore it on demand.
      vm.originalTodo = angular.extend({}, todo);
    };

    vm.doneEditing = function(todo) {
      vm.editedTodo = null;

      todo.text = todo.text.trim();

      if (!todo.text) {
        vm.removeTodo(todo);
      }
    };

    vm.revertEditing = function(todo) {
      todos[todos.indexOf(todo)] = vm.originalTodo;
      vm.doneEditing(vm.originalTodo);
    };
  }

  function CalendarWidgetController() {
    var vm = this;
    vm.dt = new Date();
  }

  function MessageController() {
    var vm = this;

    vm.content = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';

    vm.availableRecipients = ['RLake@nec.gov','RBastian@lacus.io','VMonroe@orci.ly','YMckenzie@mattis.gov','VMcmyne@molestie.org','BKliban@aliquam.gov','HHellems@tincidunt.org','KAngell@sollicitudin.ly'];
    vm.recipients = ['RLake@nec.gov','VMonroe@orci.ly'];
  }

  function AppointmentsController() {
    var vm = this;

    vm.date = new Date();
  }


})();
