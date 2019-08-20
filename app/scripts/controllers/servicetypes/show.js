'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceTypeShowCtrl
 * @description
 * # ServiceTypeShowCtrl
 * ServiceType show controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceTypeShowCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    ServiceType
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
      $rootScope.$broadcast('app:servicetypes:reload');
    };

    $scope.onNew = function() {
      $scope.servicetype = new ServiceType({});
      $scope.edit = true;
      setColorPickerOptions();
    };

    //TODO show empty state if no servicetype selected
    //listen for selected servicetype
    $rootScope.$on('servicetype:selected', function(event, servicetype) {
      $scope.servicetype = servicetype;
    });

    /**
     * @description save created servicetype
     */
    $scope.save = function() {
      //TODO show input prompt
      //TODO show loading mask

      //try update or save servicetype
      var updateOrSave = !$scope.servicetype._id
        ? $scope.servicetype.$save()
        : $scope.servicetype.$update();

      updateOrSave
        .then(function(response) {
          response = response || {};

          response.message =
            response.message || 'Service Type Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:servicetypes:reload');

          $scope.edit = false;
          setColorPickerOptions();
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };

    setColorPickerOptions();
  });
