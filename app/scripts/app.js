'use strict';

/**
 * @ngdoc overview
 * @name ng311
 * @description open311-web module
 * @version 0.1.0
 * @since  0.1.0
 */
angular
  .module('ng311', [
    'ngSanitize',
    // 'ngAnimate',
    'ngResource',
    'ui.router',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'ngAA',
    'angular-loading-bar',
    'ui.bootstrap',
    'ngNotify',
    'ngToast',
    'angucomplete-alt',
    'AngularPrint',
    'angular.morris-chart',
    'cgPrompt',
    'checklist-model',
    'ui-listView',
    'com.byteskode.angular.gallery',
    'naif.base64',
    'ngCsv',
    'angular-theme-spinner',
    'monospaced.elastic',
    'oi.select',
    'uz.mailto'
  ])
  .config(function (
    $stateProvider, $urlRouterProvider,
    $authProvider, cfpLoadingBarProvider, ENV
  ) {

    //configure ngAA
    //see https://github.com/lykmapipo/ngAA
    $authProvider.afterSigninRedirectTo = 'app.servicerequests.list';

    //make use of session storage
    $authProvider.storage = 'sessionStorage';

    //config ngAA profile key
    $authProvider.profileKey = 'party';

    //config signin url
    $authProvider.signinUrl = [ENV.apiEndPoint.web, 'signin'].join('/');

    //config signin template url
    $authProvider.signinTemplateUrl = 'views/auth/signin.html';

    //configure loading bar
    cfpLoadingBarProvider.includeSpinner = false;

    //unmatched route handler
    $urlRouterProvider.otherwise('/servicerequests');

    //configure application states
    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: 'views/app.html',
        controller: 'AppCtrl',
        resolve: {
          party: function ($auth) {
            return $auth.getProfile();
          }
        }
      })
      .state('app.notifications', {
        url: '/notifications',
        templateUrl: 'views/dashboard/notifications.html',
        controller: function () {},
        data: {
          authenticated: true
        }
      });

  })
  .run(function ($rootScope, ngNotify, ENV) {

    //expose environment to $rootScope
    $rootScope.ENV = ENV;

    //configure ngNotify
    ngNotify.config({
      position: 'top',
      duration: 5000,
      button: true,
      theme: 'pastel'
    });

  });
