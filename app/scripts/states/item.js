'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Item
 * @description
 * Item states configuration of ng311
 */
angular.module('ng311').config(function($stateProvider) {
  //items management states
  $stateProvider.state('app.manage.items', {
    url: '/items',
    views: {
      list: {
        templateUrl: 'views/items/_partials/list.html',
        controller: 'ItemIndexCtrl',
      },
      detail: {
        templateUrl: 'views/items/_partials/detail.html',
        controller: 'ItemShowCtrl',
      },
    },
    data: {
      authenticated: true,
    },
  });
});
