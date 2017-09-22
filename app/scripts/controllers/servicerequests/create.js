'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceRequestCreateCtrl
 * @description
 * # ServiceRequestCreateCtrl
 * ServiceRequest create controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceRequestCreateCtrl', function (
    $rootScope, $scope, $state, $stateParams,
    ServiceRequest, endpoints, party) {

    //action performed by this controller
    $scope.action = 'Create';

    $scope.edit = true;

    $scope.groups = endpoints.servicegroups.servicegroups;
    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
    $scope.services = endpoints.services.services;
    $scope.methods = party.settings.servicerequest.methods;

    //instantiate new servicerequest
    $scope.servicerequest = new ServiceRequest({
      call: {
        startedAt: new Date()
      },
      method: { name: undefined },
      reporter: ($stateParams || {}).reporter || {},
      jurisdiction: ($stateParams || {}).jurisdiction
    });


    /**
     * @description save created servicerequest
     */
    $scope.save = function () {

      $scope.create = false;
      $scope.updated = true;

      //set call end time
      if (!$scope.servicerequest._id) {
        $scope.servicerequest.call.endedAt = new Date();
      }

      $scope.servicerequest.$save().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Service Request Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('servicerequest:create:success', response);

          $rootScope.$broadcast('app:servicerequests:reload');

          $state.go('app.servicerequests.list');

        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
          $rootScope.$broadcast('servicerequest:create:error', error);
        });
    };


  });
