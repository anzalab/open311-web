'use strict';

/**
 * @ngdoc function
 * @name ng311.states:ServiceGroup
 * @description
 * ServiceGroup states configuration of ng311 
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    //servicegroups management states
    $stateProvider
      .state('app.manage.servicegroups', {
        url: '/servicegroups',
        views: {
          list: {
            templateUrl: 'views/servicegroups/_partials/list.html',
            controller: 'ServiceGroupIndexCtrl'
          },
          detail: {
            templateUrl: 'views/servicegroups/_partials/detail.html',
            controller: 'ServiceGroupShowCtrl'
          }
        },
        data: {
          authenticated: true
        }
      });
  });
