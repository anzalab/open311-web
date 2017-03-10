'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceShowCtrl
 * @description
 * # ServiceShowCtrl
 * Service show controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceShowCtrl', function (
    $rootScope, $scope, $state, $stateParams, Service
  ) {

    $scope.edit = false;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    //TODO show empty state if no service selected
    //listen for selected juridiction
    $rootScope.$on('service:selected', function (event, service) {
      $scope.service = service;
    });


    /**
     * @description block created service
     */
    $scope.block = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.save();
    };


    /**
     * @description unblock created service
     */
    $scope.unblock = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.save();
    };

    /**
     * @description save created service
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      $scope.service.$update().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Service updated successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('service:update:success');

          $state.go('app.services.list');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
