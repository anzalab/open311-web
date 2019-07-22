'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Zone
 * @description
 * Zone states configuration of ng311
 */
angular.module('ng311').config(function($stateProvider) {
  //zones management states
  $stateProvider.state('app.manage.zones', {
    url: '/zones',
    views: {
      list: {
        templateUrl: 'views/zones/_partials/list.html',
        controller: 'ZoneIndexCtrl',
      },
      detail: {
        templateUrl: 'views/zones/_partials/detail.html',
        controller: 'ZoneShowCtrl',
      },
    },
    data: {
      authenticated: true,
    },
  });
});
