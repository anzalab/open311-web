'use strict';

/**
 *@description party authentication workflows configurations
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    //party authentications flows states
    $stateProvider.state('app.profile', {
      url: '/profile',
      templateUrl: 'views/auth/profile.html',
      controller: 'AuthProfileCtrl',
      data: {
        authenticated: true
      }
    });
  });
