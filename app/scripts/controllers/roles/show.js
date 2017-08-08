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
    $rootScope, $scope, $state, $stateParams, Role, permissions
  ) {

    $scope.permissions = permissions.permissions;


    $scope.grouped = _.groupBy($scope.permissions, 'resource');
    $scope.grouped = _.map($scope.grouped, function (values, key) {
      return { resource: key, permits: values };
    });

    $scope.edit = false;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    $scope.onCancel = function () {
      $scope.edit = false;
    };

    $scope.onNew = function () {
      $scope.role = new Role({
        permissions: []
      });
      $scope.edit = true;
    };

    /**
     * @description block created role
     */
    $scope.block = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.role.deletedAt = new Date();
      $scope.save();
    };


    /**
     * @description unblock created role
     */
    $scope.unblock = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.role.deletedAt = null;
      $scope.save();
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

      //update assigned permissions
      $scope.role.permissions = $scope.role._assigned;

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
