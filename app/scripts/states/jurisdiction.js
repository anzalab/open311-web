'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Jurisdiction
 * @description
 * Jurisdiction states configuration of ng311 
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    //jurisdictions(user) management states
    $stateProvider
      .state('app.jurisdictions', {
        abstract: true,
        templateUrl: 'views/jurisdictions/main.html',
        controller: 'JurisdictionMainCtrl',
        resolve: {
          roles: function (Jurisdiction) {
            return Jurisdiction.find({
              query: {
                jurisdiction: {
                  $eq: null //TODO load undeleted(or)
                }
              }
            });
          }
        }
      })
      .state('app.jurisdictions.list', {
        url: '/jurisdictions',
        templateUrl: 'views/jurisdictions/index.html',
        controller: 'JurisdictionIndexCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.jurisdictions.show', {
        url: '/jurisdictions/show/:id',
        templateUrl: 'views/jurisdictions/create.html',
        controller: 'JurisdictionShowCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.jurisdictions.create', {
        url: '/jurisdictions/create',
        templateUrl: 'views/jurisdictions/create.html',
        controller: 'JurisdictionCreateCtrl',
        data: {
          authenticated: true
        }
      });
  });
