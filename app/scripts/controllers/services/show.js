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
    endpoints,
    ServiceGroup,
    Priority,
    ServiceType
  ) {
    $scope.edit = false;
    // $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;

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

    /**
     * @function
     * @name searchServiceGroup
     * @description Search service group by name
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.searchServiceGroups = function(query) {
      return ServiceGroup.find({ name: query }).then(function(response) {
        return response.servicegroups;
      });
    };

    /**
     * @function
     * @name searchPriorities
     * @description Search priorities by name
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.searchPriorities = function(query) {
      return Priority.find({ name: query }).then(function(response) {
        return response.priorities;
      });
    };

    /**
     * @function
     * @name searchServiceTypes
     * @description Search service types by name
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.searchServiceTypes = function(query) {
      return ServiceType.find({ name: query }).then(function(response) {
        return response.servicetypes;
      });
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
