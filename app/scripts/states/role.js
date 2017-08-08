'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Role
 * @description
 * Role states configuration of ng311 
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    //role management states
    $stateProvider
      .state('app.manage.roles', {
        url: '/roles',
        views: {
          list: {
            templateUrl: 'views/roles/_partials/list.html',
            controller: 'RoleIndexCtrl'
          },
          detail: {
            templateUrl: 'views/roles/_partials/detail.html',
            controller: 'RoleShowCtrl'
          }
        },
        data: {
          authenticated: true
        },
        resolve: {
          permissions: function (Permission) {
            return Permission.find();
          }
        }
      });
  });
