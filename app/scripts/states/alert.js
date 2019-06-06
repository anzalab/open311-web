'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Alert
 * @description Alert workflows configurations
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    $stateProvider
      .state('app.alerts', {
        url: '/alerts',
        'templateUrl': 'views/alerts/main.html',
        'controller': 'AlertMainCtrl',
        resolve: {
          endpoints: function (Summary) {
            return Summary.endpoints({
              filter: {
                deletedAt: {
                  $eq: null
                }
              }
            });
          }
        },
        data: {
          authenticated: true
        }
      });
  });
