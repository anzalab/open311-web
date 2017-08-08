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
    $rootScope, $scope, $state, $stateParams, Service,
    jurisdictions, servicegroups
  ) {

    $scope.edit = false;
    $scope.jurisdictions = jurisdictions.jurisdictions;
    $scope.servicegroups = servicegroups.servicegroups;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    $scope.onCancel = function () {
      $scope.edit = false;
      $rootScope.$broadcast('app:services:reload');
    };

    $scope.onNew = function () {
      $scope.service = new Service({});
      $scope.edit = true;
    };

    //TODO show empty state if no service selected
    //listen for selected service
    $rootScope.$on('service:selected', function (event, service) {
      $scope.service = service;
    });

    /**
     * @description save created service
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      //try update or save service
      var updateOrSave =
        (!$scope.service._id ?
          $scope.service.$save() : $scope.service.$update());

      updateOrSave.then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Service Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:services:reload');

          $scope.edit = false;

        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
