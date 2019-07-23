'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ZoneShowCtrl
 * @description
 * # ZoneShowCtrl
 * Zone show controller of ng311
 */
angular
  .module('ng311')
  .controller('ZoneShowCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    Zone
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
      $rootScope.$broadcast('app:zones:reload');
    };

    $scope.onNew = function() {
      $scope.zone = new Zone({});
      $scope.edit = true;
      setColorPickerOptions();
    };

    //TODO show empty state if no zone selected
    //listen for selected zone
    $rootScope.$on('zone:selected', function(event, zone) {
      $scope.zone = zone;
    });

    /**
     * @description save created zone
     */
    $scope.save = function() {
      //TODO show input prompt
      //TODO show loading mask

      //try update or save zone
      var updateOrSave = !$scope.zone._id
        ? $scope.zone.$save()
        : $scope.zone.$update();

      updateOrSave
        .then(function(response) {
          response = response || {};

          response.message = response.message || 'Zone Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:zones:reload');

          $scope.edit = false;
          setColorPickerOptions();
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };

    setColorPickerOptions();
  });
