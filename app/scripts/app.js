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
    'ngResource',
    'ui.router',
    'ngAA',
    'angular-loading-bar',
    'ui.bootstrap',
    'ngNotify',
    'ngToast',
    'cgPrompt',
    'checklist-model',
    'ui-listView',
    'ngCsv',
    'monospaced.elastic',
    'oi.select',
    'uz.mailto',
    'mp.colorPicker',
    'AngularPrint',
    'angular-echarts',
    'btford.socket-io',
    'focus-if'
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
      .state('app.manage', {
        abstract: true,
        templateUrl: 'views/manage/main.html'
      })
      .state('app.overviews', {
        url: '/overviews',
        templateUrl: 'views/dashboards/overviews.html',
        controller: 'DashboardOverviewCtrl',
        data: {
          authenticated: true
        },
        resolve: {
          overviews: function (Summary) {
            return Summary.overviews();
          }
        }
      }).state('app.standings', {
        url: '/standings',
        templateUrl: 'views/dashboards/standings.html',
        controller: 'DashboardStandingCtrl',
        data: {
          authenticated: true
        },
        resolve: {
          standings: function (Summary) {
            return Summary.standings();
          }
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
