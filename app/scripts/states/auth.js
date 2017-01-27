'use strict';

/**
 *@description party authentication workflows configurations
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    //party authentications flows states
    $stateProvider
      .state('change', {
        url: '/change',
        templateUrl: 'views/auth/change.html',
        controller: 'AuthChangeCtrl'
      })
      .state('forgot', {
        url: '/forgot',
        templateUrl: 'views/auth/forgot.html',
        controller: 'AuthForgotCtrl'
      })
      .state('recover', {
        url: '/recover/:token',
        templateUrl: 'views/auth/recover.html',
        controller: 'AuthRecoverCtrl'
      })
      .state('confirm', {
        url: '/confirm/:token',
        resolve: {
          confirm: function ($rootScope, $state, $stateParams, Party) {
            Party.confirm({
              token: $stateParams.token
            }).then(function (response) {
              $rootScope.$broadcast('confirmSuccess', response);
              $state.go('signin');
            }).catch(function (error) {
              $rootScope.$broadcast('confirmError', error);
              $state.go('signin');
            });
          }
        }
      }).state('unlock', {
        url: '/unlock/:token',
        resolve: {
          unlock: function ($rootScope, $state, $stateParams, Party) {
            Party.unlock({
              token: $stateParams.token
            }).then(function (response) {
              $rootScope.$broadcast('unlockSuccess', response);
              $state.go('signin');
            }).catch(function (error) {
              $rootScope.$broadcast('unlockError', error);
              $state.go('signin');
            });
          }
        }
      })
      .state('app.profile', {
        url: '/profile',
        templateUrl: 'views/auth/profile.html',
        controller: 'AuthProfileCtrl',
        data: {
          authenticated: true
        }
      });
  });
