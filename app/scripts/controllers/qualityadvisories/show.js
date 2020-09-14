'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:QualityAdvisoryShowCtrl
 * @description
 * # QualityAdvisoryShowCtrl
 * QualityAdvisory show controller of ng311
 */
angular
  .module('ng311')
  .controller('QualityAdvisoryShowCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    QualityAdvisory
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
      $rootScope.$broadcast('app:qualityadvisories:reload');
    };

    $scope.onNew = function() {
      $scope.qualityadvisory = new QualityAdvisory({});
      $scope.edit = true;
      setColorPickerOptions();
    };

    //TODO show empty state if no qualityadvisory selected
    //listen for selected qualityadvisory
    $rootScope.$on('qualityadvisory:selected', function(
      event,
      qualityadvisory
    ) {
      $scope.qualityadvisory = qualityadvisory;
    });

    /**
     * @description save created qualityadvisory
     */
    $scope.save = function() {
      //TODO show input prompt
      //TODO show loading mask

      //try update or save qualityadvisory
      var updateOrSave = !$scope.qualityadvisory._id
        ? $scope.qualityadvisory.$save()
        : $scope.qualityadvisory.$update();

      updateOrSave
        .then(function(response) {
          response = response || {};

          response.message =
            response.message || 'Quality Advisory Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:qualityadvisories:reload');

          $scope.edit = false;
          setColorPickerOptions();
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };

    setColorPickerOptions();
  });
