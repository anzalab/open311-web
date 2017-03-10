'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Party
 * @description
 * Party states configuration of ng311 
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    //parties(user) management states
    $stateProvider
      .state('app.manage.parties', {
        url: '/parties',
        views: {
          list: {
            templateUrl: 'views/parties/_partials/list.html',
            controller: 'PartyIndexCtrl'
          },
          detail: {
            templateUrl: 'views/parties/_partials/detail.html',
            controller: 'PartyShowCtrl'
          }
        },
        data: {
          authenticated: true
        },
        resolve: {
          roles: function (Role) {
            return Role.find({
              query: {
                deletedAt: {
                  $eq: null
                }
              }
            });
          }
        }
      });
  });
