'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Status
 * @description
 * Status states configuration of ng311
 */
angular.module('ng311').config(function($stateProvider) {
  //statuses management states
  $stateProvider.state('app.manage.statuses', {
    url: '/statuses',
    views: {
      list: {
        templateUrl: 'views/statuses/_partials/list.html',
        controller: 'StatusIndexCtrl',
      },
      detail: {
        templateUrl: 'views/statuses/_partials/detail.html',
        controller: 'StatusShowCtrl',
      },
    },
    data: {
      authenticated: true,
    },
  });
});
