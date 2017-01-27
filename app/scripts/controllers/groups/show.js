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

    //load group
    $scope.group = ServiceGroup.get({
      id: $stateParams.id
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

      $scope.group.$update().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'User updated successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('group:update:success');

          $state.go('app.groups.list');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
