'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Jurisdiction
 * @description
 * Jurisdiction states configuration of ng311
 */
angular.module('ng311').config(function($stateProvider) {
  //jurisdictions management states
  $stateProvider.state('app.manage.jurisdictions', {
    url: '/jurisdictions',
    views: {
      list: {
        templateUrl: 'views/jurisdictions/_partials/list.html',
        controller: 'JurisdictionIndexCtrl',
      },
      detail: {
        templateUrl: 'views/jurisdictions/_partials/detail.html',
        controller: 'JurisdictionShowCtrl',
      },
    },
    data: {
      authenticated: true,
    },
  });
});
