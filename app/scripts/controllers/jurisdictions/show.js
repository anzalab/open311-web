'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:JurisdictionShowCtrl
 * @description
 * # JurisdictionShowCtrl
 * Jurisdiction show controller of ng311
 */
angular
  .module('ng311')
  .controller('JurisdictionShowCtrl', function (
    $rootScope, $scope, $state, $stateParams, Jurisdiction
  ) {

    $scope.edit = false;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    //load jurisdiction
    $scope.jurisdiction = Jurisdiction.get({
      id: $stateParams.id
    });


    /**
     * @description block created jurisdiction
     */
    $scope.block = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.save();
    };


    /**
     * @description unblock created jurisdiction
     */
    $scope.unblock = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.save();
    };

    /**
     * @description save created jurisdiction
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      $scope.jurisdiction.$update().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Jurisdiction updated successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('jurisdiction:update:success');

          $state.go('app.jurisdictions.list');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
