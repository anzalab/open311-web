'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:PriorityShowCtrl
 * @description
 * # PriorityShowCtrl
 * Priority show controller of ng311
 */
angular
  .module('ng311')
  .controller('PriorityShowCtrl', function (
    $rootScope, $scope, $state, $stateParams, Priority
  ) {

    $scope.edit = false;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    //TODO show empty state if no priority selected
    //listen for selected juridiction
    $rootScope.$on('priority:selected', function (event, priority) {
      $scope.priority = priority;
    });


    /**
     * @description block created priority
     */
    $scope.block = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.save();
    };


    /**
     * @description unblock created priority
     */
    $scope.unblock = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.save();
    };

    /**
     * @description save created priority
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      $scope.priority.$update().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Priority updated successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('priority:update:success');

          $state.go('app.priorities.list');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
