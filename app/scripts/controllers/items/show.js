'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ItemShowCtrl
 * @description
 * # ItemShowCtrl
 * Item show controller of ng311
 */
angular
  .module('ng311')
  .controller('ItemShowCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    Item
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
      $rootScope.$broadcast('app:items:reload');
    };

    $scope.onNew = function() {
      $scope.item = new Item({});
      $scope.edit = true;
      setColorPickerOptions();
    };

    //TODO show empty state if no item selected
    //listen for selected item
    $rootScope.$on('item:selected', function(event, item) {
      $scope.item = item;
    });

    /**
     * @description save created item
     */
    $scope.save = function() {
      //TODO show input prompt
      //TODO show loading mask

      //try update or save item
      var updateOrSave = !$scope.item._id
        ? $scope.item.$save()
        : $scope.item.$update();

      updateOrSave
        .then(function(response) {
          response = response || {};

          response.message = response.message || 'Item Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:items:reload');

          $scope.edit = false;
          setColorPickerOptions();
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };

    setColorPickerOptions();
  });
