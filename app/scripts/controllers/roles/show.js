'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:RoleShowCtrl
 * @description
 * # RoleShowCtrl
 * Role show controller of ng311
 */
angular
  .module('ng311')
  .controller('RoleShowCtrl', function (
    $rootScope, $scope, $state, $stateParams, Role
  ) {

    $scope.edit = false;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    $scope.onCancel = function () {
      $scope.edit = false;
    };

    $scope.onNew = function () {
      $scope.role = new Role({});
      $scope.edit = true;
    };

    //TODO show empty state if no role selected
    //listen for selected juridiction
    $rootScope.$on('role:selected', function (event, role) {
      $scope.role = role;
    });

    /**
     * @description save created role
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask
      var updateOrSave = $scope.role.$update();
      if (!$scope.role._id) {
        updateOrSave = $scope.role.$save();
      }
      updateOrSave.then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Role Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:parties:reload');

          $scope.edit = false;

        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
