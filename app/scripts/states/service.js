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
      .state('app.manage.services', {
        url: '/services',
        views: {
          list: {
            templateUrl: 'views/services/_partials/list.html',
            controller: 'ServiceIndexCtrl'
          },
          detail: {
            templateUrl: 'views/services/_partials/detail.html',
            controller: 'ServiceShowCtrl',
            resolve: {
              jurisdictions: function (Jurisdiction) {
                return Jurisdiction.find({
                  query: {
                    deletedAt: {
                      $eq: null
                    }
                  }
                });
              },
              servicegroups: function (ServiceGroup) {
                return ServiceGroup.find({
                  query: {
                    deletedAt: {
                      $eq: null
                    }
                  }
                });
              }
            }
          }
        },
        data: {
          authenticated: true
        }
      });
  });
