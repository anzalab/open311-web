'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Service
 * @description
 * Service states configuration of ng311 
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    //services management states
    $stateProvider
      .state('app.services', {
        abstract: true,
        templateUrl: 'views/services/main.html',
        controller: 'ServiceMainCtrl',
        resolve: {
          roles: function (Service) {
            return Service.find({
              query: {
                jurisdiction: {
                  $eq: null //TODO load undeleted(or)
                }
              }
            });
          }
        }
      })
      .state('app.services.list', {
        url: '/services',
        templateUrl: 'views/services/index.html',
        controller: 'ServiceIndexCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.services.show', {
        url: '/services/show/:id',
        templateUrl: 'views/services/create.html',
        controller: 'ServiceShowCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.services.create', {
        url: '/services/create',
        templateUrl: 'views/services/create.html',
        controller: 'ServiceCreateCtrl',
        data: {
          authenticated: true
        }
      });
  });
