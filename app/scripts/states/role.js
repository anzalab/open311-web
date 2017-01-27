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
      .state('app.roles', {
        abstract: true,
        templateUrl: 'views/roles/main.html',
        controller: 'RoleMainCtrl',
        resolve: {
          permissions: function (Permission) {
            return Permission.find();
          }
        }
      })
      .state('app.roles.list', {
        url: '/roles',
        templateUrl: 'views/roles/index.html',
        controller: 'RoleIndexCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.roles.show', {
        url: '/roles/show/:id',
        templateUrl: 'views/roles/create.html',
        controller: 'RoleShowCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.roles.create', {
        url: '/roles/create',
        templateUrl: 'views/roles/create.html',
        controller: 'RoleCreateCtrl',
        data: {
          authenticated: true
        }
      });
  });
