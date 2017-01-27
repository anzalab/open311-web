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

    //groups management states
    $stateProvider
      .state('app.groups', {
        abstract: true,
        templateUrl: 'views/groups/main.html',
        controller: 'ServiceGroupMainCtrl'
      })
      .state('app.groups.list', {
        url: '/groups',
        templateUrl: 'views/groups/index.html',
        controller: 'ServiceGroupIndexCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.groups.show', {
        url: '/groups/show/:id',
        templateUrl: 'views/groups/create.html',
        controller: 'ServiceGroupShowCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.groups.create', {
        url: '/groups/create',
        templateUrl: 'views/groups/create.html',
        controller: 'ServiceGroupCreateCtrl',
        data: {
          authenticated: true
        }
      });
  });
