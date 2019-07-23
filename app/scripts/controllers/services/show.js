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
  .controller('ServiceShowCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    Service,
    endpoints
  ) {
    $scope.edit = false;
    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
    $scope.servicegroups = endpoints.servicegroups.servicegroups;
    $scope.priorities = endpoints.priorities.priorities;

    /**
     * @function
     * @name setColorPickerOptions
     * @description Set or Update color picker options when need to change
     *
     * @version  0.1.0
     * @since 0.1.0
     */
    var setColorPickerOptions = function() {
      $scope.colorPickerOptions = {
        swatchPos: 'right',
        disabled: !$scope.edit,
        inputClass: 'form-control',
        format: 'hexString',
        round: true,
      };
    };

    $scope.onEdit = function() {
      $scope.edit = true;
      setColorPickerOptions();
    };

    $scope.onCancel = function() {
      $scope.edit = false;
      setColorPickerOptions();
      $rootScope.$broadcast('app:services:reload');
    };

    $scope.onNew = function() {
      $scope.service = new Service({});
      $scope.edit = true;
      setColorPickerOptions();
    };

    //TODO show empty state if no service selected
    //listen for selected service
    $rootScope.$on('service:selected', function(event, service) {
      $scope.service = service;
    });

    /**
     * @description save created service
     */
    $scope.save = function() {
      //TODO show input prompt
      //TODO show loading mask

      //try update or save service
      var updateOrSave = !$scope.service._id
        ? $scope.service.$save()
        : $scope.service.$update();

      updateOrSave
        .then(function(response) {
          response = response || {};

          response.message = response.message || 'Service Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:services:reload');

          $scope.edit = false;
          setColorPickerOptions();
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };

    setColorPickerOptions();
  });
