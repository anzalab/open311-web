'use strict';

/**
 * @ngdoc function
 * @name ng311.states:QualityMeasure
 * @description
 * QualityMeasure states configuration of ng311
 */
angular.module('ng311').config(function($stateProvider) {
  //qualitymeasures management states
  $stateProvider.state('app.manage.qualitymeasures', {
    url: '/qualitymeasures',
    views: {
      list: {
        templateUrl: 'views/qualitymeasures/_partials/list.html',
        controller: 'QualityMeasureIndexCtrl',
      },
      detail: {
        templateUrl: 'views/qualitymeasures/_partials/detail.html',
        controller: 'QualityMeasureShowCtrl',
      },
    },
    data: {
      authenticated: true,
    },
  });
});
