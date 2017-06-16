'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:RoleEditCtrl
 * @description
 * # RoleEditCtrl
 * Role edit controller of ng311
 */
angular
  .module('ng311')
  .controller('RoleEditCtrl', function ($scope, $state, $stateParams, Role) {

    //action performed by this controller
    $scope.action = 'Edit';


    /**
     * @description load role
     */
    $scope.role = Role.get({
      id: $stateParams.id
    });


    /**
     * @description save edited role
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.role.$update().then(function () {
        $state.go('app.roles.list');
      });
      //TODO catch errors and notify
    };

  });
