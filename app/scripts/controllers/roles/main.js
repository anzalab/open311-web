'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:RoleMainCtrl
 * @description
 * # RoleMainCtrl
 * Role main controller of ng311
 */
angular
  .module('ng311')
  .controller('RoleMainCtrl', function ($rootScope, $scope, $state, prompt,
    Role) {

    //set app to mailbox
    $rootScope.appMailbox = true;

    //hide aside
    $rootScope.showAside = true;


    /**
     * @description delete role
     */
    $scope.delete = function (role) {
      prompt({
          title: 'Role Delete',
          message: 'Are you sure, you want to permanently delete this role?'
        }).then(function () {
          return role.$delete();
        })
        .then(function (response) {

          response = response || {};

          response.message =
            response.message || 'User deleted successfully';

          $rootScope.$broadcast('appSuccess', response);

          $state.go('app.roles.list');

        })
        .catch(function (error) {
          if (error) {
            $rootScope.$broadcast('appError', error);
          }
        });
    };

  });
