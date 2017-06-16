'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:RoleCreateCtrl
 * @description
 * # RoleCreateCtrl
 * Role create controller of ng311
 */
angular
  .module('ng311')
  .controller('RoleCreateCtrl', function ($rootScope, $scope, $state,
    Role, permissions) {

    //action performed by this controller
    $scope.action = 'Create';

    $scope.edit = true;

    $scope.permissions = permissions.permissions;


    $scope.grouped = _.groupBy($scope.permissions, 'resource');
    $scope.grouped = _.map($scope.grouped, function (values, key) {
      return { resource: key, permits: values };
    });

    //instantiate new role
    $scope.role = new Role({
      permissions: []
    });

    /**
     * @description save created role
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.role.permissions = $scope.role._assigned;

      $scope.role.$save().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Role created successfully';

          $rootScope.$broadcast('appSuccess', response);

          $state.go('app.roles.list');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
