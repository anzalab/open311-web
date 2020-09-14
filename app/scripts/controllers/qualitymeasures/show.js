'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:QualityMeasureShowCtrl
 * @description
 * # QualityMeasureShowCtrl
 * QualityMeasure show controller of ng311
 */
angular
  .module('ng311')
  .controller('QualityMeasureShowCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    QualityMeasure
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
      $rootScope.$broadcast('app:qualitymeasures:reload');
    };

    $scope.onNew = function() {
      $scope.qualitymeasure = new QualityMeasure({});
      $scope.edit = true;
      setColorPickerOptions();
    };

    //TODO show empty state if no qualitymeasure selected
    //listen for selected qualitymeasure
    $rootScope.$on('qualitymeasure:selected', function(event, qualitymeasure) {
      $scope.qualitymeasure = qualitymeasure;
    });

    /**
     * @description save created qualitymeasure
     */
    $scope.save = function() {
      //TODO show input prompt
      //TODO show loading mask

      //try update or save qualitymeasure
      var updateOrSave = !$scope.qualitymeasure._id
        ? $scope.qualitymeasure.$save()
        : $scope.qualitymeasure.$update();

      updateOrSave
        .then(function(response) {
          response = response || {};

          response.message =
            response.message || 'Quality Measure Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:qualitymeasures:reload');

          $scope.edit = false;
          setColorPickerOptions();
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };

    setColorPickerOptions();
  });
