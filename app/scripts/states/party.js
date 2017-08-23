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

    //parties management states
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
            controller: 'PartyShowCtrl',
            resolve: {
              jurisdictions: function (Jurisdiction) {
                return Jurisdiction.find({
                  limit: 1000,
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
