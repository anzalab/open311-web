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
      .state('app.parties', {
        abstract: true,
        templateUrl: 'views/parties/main.html',
        controller: 'PartyMainCtrl',
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
      })
      .state('app.parties.list', {
        url: '/parties',
        templateUrl: 'views/parties/index.html',
        controller: 'PartyIndexCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.parties.show', {
        url: '/parties/show/:id',
        templateUrl: 'views/parties/create.html',
        controller: 'PartyShowCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.parties.create', {
        url: '/parties/create',
        templateUrl: 'views/parties/create.html',
        controller: 'PartyCreateCtrl',
        data: {
          authenticated: true
        }
      });
  });
