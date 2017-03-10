'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceGroupShowCtrl
 * @description
 * # ServiceGroupShowCtrl
 * ServiceGroup show controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceGroupShowCtrl', function (
    $rootScope, $scope, $state, $stateParams, ServiceGroup
  ) {

    $scope.edit = false;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    //TODO show empty state if no servicegroup selected
    //listen for selected juridiction
    $rootScope.$on('servicegroup:selected', function (event, servicegroup) {
      $scope.servicegroup = servicegroup;
    });


    /**
     * @description block created group
     */
    $scope.block = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.save();
    };


    /**
     * @description unblock created group
     */
    $scope.unblock = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.save();
    };

    /**
     * @description save created group
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      $scope.servicegroup.$update().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'User updated successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('servicegroup:update:success');

          $state.go('app.servicegroups.list');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
