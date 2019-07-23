'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:PriorityShowCtrl
 * @description
 * # PriorityShowCtrl
 * Priority show controller of ng311
 */
angular
  .module('ng311')
  .controller('PriorityShowCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    Priority
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
      $rootScope.$broadcast('app:priorities:reload');
    };

    $scope.onNew = function() {
      $scope.priority = new Priority({ weight: 0, color: '#FF9800' });
      $scope.edit = true;
      setColorPickerOptions();
    };

    //TODO show empty state if no priority selected
    //listen for selected jurisdiction
    $rootScope.$on('priority:selected', function(event, priority) {
      $scope.priority = priority;
    });

    /**
     * @description save created priority
     */
    $scope.save = function() {
      //TODO show input prompt
      //TODO show loading mask

      //try update or save priority
      var updateOrSave = !$scope.priority._id
        ? $scope.priority.$save()
        : $scope.priority.$update();

      updateOrSave
        .then(function(response) {
          response = response || {};

          response.message = response.message || 'Priority Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:priorities:reload');

          $scope.edit = false;
          setColorPickerOptions();
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };

    setColorPickerOptions();
  });
