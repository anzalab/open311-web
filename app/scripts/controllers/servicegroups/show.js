'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceGroupShowCtrl
 * @description
 * # ServiceGroupShowCtrl
 * ServiceGroup show controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceGroupShowCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    ServiceGroup
  ) {
    $scope.edit = false;

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
      $rootScope.$broadcast('app:servicegroups:reload');
    };

    $scope.onNew = function() {
      $scope.servicegroup = new ServiceGroup({});
      $scope.edit = true;
      setColorPickerOptions();
    };

    //TODO show empty state if no servicegroup selected
    //listen for selected servicegroup
    $rootScope.$on('servicegroup:selected', function(event, servicegroup) {
      $scope.servicegroup = servicegroup;
    });

    /**
     * @description save created servicegroup
     */
    $scope.save = function() {
      //TODO show input prompt
      //TODO show loading mask

      //try update or save servicegroup
      var updateOrSave = !$scope.servicegroup._id
        ? $scope.servicegroup.$save()
        : $scope.servicegroup.$update();

      updateOrSave
        .then(function(response) {
          response = response || {};

          response.message =
            response.message || 'Service Group Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:servicegroups:reload');

          $scope.edit = false;
          setColorPickerOptions();
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };

    setColorPickerOptions();
  });
