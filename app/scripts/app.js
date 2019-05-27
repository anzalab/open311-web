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
    'ngCsv',
    'monospaced.elastic',
    'oi.select',
    'uz.mailto',
    'mp.colorPicker',
    'AngularPrint',
    'angular-echarts',
    'btford.socket-io',
    'focus-if',
    'pickadate',
    'ui-leaflet',
    'ngNumeraljs',
  ])
  .config(function(
    $stateProvider,
    $urlRouterProvider,
    $authProvider,
    cfpLoadingBarProvider,
    $numeraljsConfigProvider,
    ENV
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

    //configure numeraljs formating
    $numeraljsConfigProvider.register('locale', ENV.settings.locale, {
      abbreviations: ENV.settings.abbreviations,
    });

    //switch locale to sw
    $numeraljsConfigProvider.locale(ENV.settings.locale);

    //unmatched route handler
    $urlRouterProvider.otherwise('/servicerequests');

    //configure application states
    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: 'views/app.html',
        controller: 'AppCtrl',
        resolve: {
          party: function($auth) {
            return $auth.getProfile();
          },
          token: function($q, ngAAToken) {
            return $q.resolve(ngAAToken.getToken());
          },
        },
      })
      .state('app.manage', {
        abstract: true,
        templateUrl: 'views/manage/main.html',
      })
      .state('app.overviews', {
        url: '/overviews',
        templateUrl: 'views/dashboards/overviews/index.html',
        controller: 'DashboardOverviewCtrl',
        data: {
          authenticated: true,
        },
        resolve: {
          endpoints: function(Summary) {
            return Summary.endpoints({
              query: {
                deletedAt: {
                  $eq: null,
                },
              },
            });
          },
        },
      })
      .state('app.standings', {
        url: '/standings',
        templateUrl: 'views/dashboards/standings.html',
        controller: 'DashboardStandingCtrl',
        data: {
          authenticated: true,
        },
        resolve: {
          endpoints: function(Summary) {
            return Summary.endpoints({
              query: {
                deletedAt: {
                  $eq: null,
                },
              },
            });
          },
        },
      })
      .state('app.comparison', {
        //TODO refactor to reports states
        url: '/comparison',
        templateUrl: 'views/dashboards/comparison.html',
        controller: 'DashboardComparisonCtrl',
        data: {
          authenticated: true,
        },
      })
      .state('app.performances', {
        url: '/performances',
        templateUrl: 'views/dashboards/performance/index.html',
        controller: 'DashboardPerformanceCtrl',
        params: {
          jurisdiction: null,
          startedAt: null,
          endedAt: null,
        },
        data: {
          authenticated: true,
        },
        resolve: {
          endpoints: function(Summary) {
            return Summary.endpoints({
              query: {
                deletedAt: {
                  $eq: null,
                },
              },
            });
          },
        },
      })
      .state('app.operations', {
        url: '/operations',
        templateUrl: 'views/dashboards/operation/index.html',
        controller: 'DashboardOperationCtrl',
        params: {
          jurisdiction: null,
          startedAt: null,
          endedAt: null,
        },
        data: {
          authenticated: true,
        },
        resolve: {
          endpoints: function(Summary) {
            return Summary.endpoints({
              query: {
                deletedAt: {
                  $eq: null,
                },
              },
            });
          },
        },
      })
      .state('app.exports', {
        url: '/exports',
        templateUrl: 'views/dashboards/exports.html',
        controller: 'DashboardExportCtrl',
        data: {
          authenticated: true,
        },
        resolve: {
          endpoints: function(Summary) {
            return Summary.endpoints({
              query: {
                deletedAt: {
                  $eq: null,
                },
              },
            });
          },
        },
      });
  })
  .run(function($rootScope, ngNotify, ENV) {
    //expose environment to $rootScope
    $rootScope.ENV = ENV;

    //configure ngNotify
    ngNotify.config({
      position: 'top',
      duration: 5000,
      button: true,
      theme: 'pastel',
    });
  });
