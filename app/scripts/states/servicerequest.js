'use strict';

/**
 * @ngdoc function
 * @name ng311.states:ServiceRequest
 * @description
 * ServiceRequest states configuration of ng311 
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    //servicerequests management states
    $stateProvider
      .state('app.servicerequests', {
        // abstract: true,
        templateUrl: 'views/servicerequests/main.html',
        controller: 'ServiceRequestMainCtrl',
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
          groups: function (ServiceGroup) {
            return ServiceGroup.find({
              query: {
                deletedAt: {
                  $eq: null
                }
              }
            });
          },
          services: function (Service) {
            return Service.find({
              query: {
                deletedAt: {
                  $eq: null
                }
              }
            });
          },
          statuses: function (Status) {
            return Status.find({
              query: {
                deletedAt: {
                  $eq: null
                }
              }
            });
          },
          priorities: function (Priority) {
            return Priority.find({
              query: {
                deletedAt: {
                  $eq: null
                }
              }
            });
          },
          assignee: function (Party) {
            // TODO fetch partis of specific area who are internal
            // workers
            return Party.find({
              query: {
                deletedAt: {
                  $eq: null
                },
                'relation.name': 'Internal',
                'relation.type': 'Worker'
              }
            });
          },
          summaries: function (Summary) {
            return Summary.issues();
          }
        }
      })
      .state('app.servicerequests.list', {
        url: '/servicerequests',
        templateUrl: 'views/servicerequests/index.html',
        controller: 'ServiceRequestIndexCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.servicerequests.show', {
        url: '/servicerequests/show/:id',
        templateUrl: 'views/servicerequests/create.html',
        controller: 'ServiceRequestShowCtrl',
        data: {
          authenticated: true
        }
      })
      .state('app.servicerequests.create', {
        url: '/servicerequests/create',
        templateUrl: 'views/servicerequests/create.html',
        controller: 'ServiceRequestCreateCtrl',
        data: {
          authenticated: true
        }
      });
  });
