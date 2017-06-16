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
  .controller('RoleShowCtrl', function ($rootScope, $scope, $state,
    $stateParams, Role, permissions) {

    $scope.edit = false;
    $scope.permissions = permissions.permissions;

    $scope.grouped = _.groupBy($scope.permissions, 'resource');
    $scope.grouped = _.map($scope.grouped, function (values, key) {
      return { resource: key, permits: values };
    });

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    //load role
    // $scope.role = Role.get({
    //   id: $stateParams.id,
    //   populate: [{
    //     path: 'permissions'
    //   }]
    // });

    //TODO show empty state if no role selected
    //listen for selected juridiction
    $rootScope.$on('role:selected', function (event, role) {
      $scope.role = role;
    });



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

    /**
     * @description save created role
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.role.permissions = $scope.role._assigned;

      $scope.role.$update().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Role updated successfully';

          $rootScope.$broadcast('appSuccess', response);

          $state.go('app.roles.list');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
