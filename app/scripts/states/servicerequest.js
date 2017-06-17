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
          endpoints: function (Summary) {
            return Summary.endpoints({
              query: {
                deletedAt: {
                  $eq: null
                }
              }
            });
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
      .state('app.create_servicerequests', {
        url: '/servicerequests/create',
        params: { //hack to allow state go with reporter $state param
          reporter: {},
          jurisdiction: undefined,
          servicerequest: undefined
        },
        templateUrl: 'views/servicerequests/create.html',
        controller: 'ServiceRequestCreateCtrl',
        data: {
          authenticated: true
        },
        resolve: {
          endpoints: function (Summary) {
            return Summary.endpoints({
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
