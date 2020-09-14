'use strict';

/**
 * @ngdoc function
 * @name ng311.states:QualityAdvisory
 * @description
 * QualityAdvisory states configuration of ng311
 */
angular.module('ng311').config(function($stateProvider) {
  //qualityadvisories management states
  $stateProvider.state('app.manage.qualityadvisories', {
    url: '/qualityadvisories',
    views: {
      list: {
        templateUrl: 'views/qualityadvisories/_partials/list.html',
        controller: 'QualityAdvisoryIndexCtrl',
      },
      detail: {
        templateUrl: 'views/qualityadvisories/_partials/detail.html',
        controller: 'QualityAdvisoryShowCtrl',
      },
    },
    data: {
      authenticated: true,
    },
  });
});
