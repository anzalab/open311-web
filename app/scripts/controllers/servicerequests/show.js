'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceRequestShowCtrl
 * @description
 * # ServiceRequestShowCtrl
 * ServiceRequest show controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceRequestShowCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    ServiceRequest,
    $timeout
  ) {
    $scope.edit = false;
    $scope.roles = roles.roles;

    $scope.onEdit = function() {
      $scope.edit = true;
    };

    //load party
    $scope.party = ServiceRequest.get({
      id: $stateParams.id,
    });

    /**
     * @description block created party
     */
    $scope.block = function() {
      //TODO show input prompt
      //TODO show loading mask
      $scope.party.deletedAt = new Date();
      $scope.save();
    };

    /**
     * @description unblock created party
     */
    $scope.unblock = function() {
      //TODO show input prompt
      //TODO show loading mask
      $scope.party.deletedAt = null;
      $scope.save();
    };

    /**
     * @description save created party
     */
    $scope.save = function() {
      //TODO show input prompt
      //TODO show loading mask
      $scope.party.roles = $scope.party._assigned;

      $scope.party
        .$update()
        .then(function(response) {
          response = response || {};

          response.message = response.message || 'User updated successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('servicerequest:update:success', response);
          $rootScope.$broadcast('app:servicerequests:reload');

          $state.go('app.servicerequests.list');
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
          $rootScope.$broadcast('servicerequest:update:error', error);
        });
    };
  });
