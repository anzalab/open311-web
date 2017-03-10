'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:StatusShowCtrl
 * @description
 * # StatusShowCtrl
 * Status show controller of ng311
 */
angular
  .module('ng311')
  .controller('StatusShowCtrl', function (
    $rootScope, $scope, $state, $stateParams, Status
  ) {

    $scope.edit = false;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    //TODO show empty state if no status selected
    //listen for selected juridiction
    $rootScope.$on('status:selected', function (event, status) {
      $scope.status = status;
    });


    /**
     * @description block created status
     */
    $scope.block = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.save();
    };


    /**
     * @description unblock created status
     */
    $scope.unblock = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.save();
    };

    /**
     * @description save created status
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      $scope.status.$update().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Status updated successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('status:update:success');

          $state.go('app.statuses.list');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
