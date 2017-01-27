'use strict';

/**
 *@description dashboard workflows configurations
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    $stateProvider
      .state('app.dashboard', {
        url: '/dashboard',
        views: {
          aside: {
            templateUrl: 'views/dashboard/aside.html'
          },
          main: {
            templateUrl: 'views/dashboard/main.html',
            controller: 'DashboardCtrl'
          }
        },
        data: {
          authenticated: true
        }
      });
  });
