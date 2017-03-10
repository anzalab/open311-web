'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Priority
 * @description
 * Priority states configuration of ng311 
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    //priorities management states
    $stateProvider
      .state('app.manage.priorities', {
        url: '/priorities',
        views: {
          list: {
            templateUrl: 'views/priorities/_partials/list.html',
            controller: 'PriorityIndexCtrl'
          },
          detail: {
            templateUrl: 'views/priorities/_partials/detail.html',
            controller: 'PriorityShowCtrl'
          }
        },
        data: {
          authenticated: true
        }
      });
  });
