'use strict';

/**
 * @ngdoc function
 * @name ng311.states:ServiceType
 * @description
 * ServiceType states configuration of ng311
 */
angular.module('ng311').config(function($stateProvider) {
  //servicetypes management states
  $stateProvider.state('app.manage.servicetypes', {
    url: '/servicetypes',
    views: {
      list: {
        templateUrl: 'views/servicetypes/_partials/list.html',
        controller: 'ServiceTypeIndexCtrl',
      },
      detail: {
        templateUrl: 'views/servicetypes/_partials/detail.html',
        controller: 'ServiceTypeShowCtrl',
      },
    },
    data: {
      authenticated: true,
    },
  });
});
