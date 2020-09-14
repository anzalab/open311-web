'use strict';

/**
 * @ngdoc function
 * @name ng311.states:QualityCause
 * @description
 * QualityCause states configuration of ng311
 */
angular.module('ng311').config(function($stateProvider) {
  //qualitycauses management states
  $stateProvider.state('app.manage.qualitycauses', {
    url: '/qualitycauses',
    views: {
      list: {
        templateUrl: 'views/qualitycauses/_partials/list.html',
        controller: 'QualityCauseIndexCtrl',
      },
      detail: {
        templateUrl: 'views/qualitycauses/_partials/detail.html',
        controller: 'QualityCauseShowCtrl',
      },
    },
    data: {
      authenticated: true,
    },
  });
});
