'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:JurisdictionShowCtrl
 * @description
 * # JurisdictionShowCtrl
 * Jurisdiction show controller of ng311
 */
angular
  .module('ng311')
  .controller('JurisdictionShowCtrl', function (
    $rootScope, $scope, $state, $stateParams, Jurisdiction
  ) {

    $scope.edit = false;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    $scope.onCancel = function () {
      $scope.edit = false;
    };

    $scope.onNew = function () {
      $scope.jurisdiction = new Jurisdiction({
        location: {
          coordinates: [0, 0]
        }
      });
      $scope.edit = true;
    };

    //TODO show empty state if no jurisdiction selected
    //listen for selected jurisdiction
    $rootScope.$on('jurisdiction:selected', function (event, jurisdiction) {
      $scope.jurisdiction = jurisdiction;
    });

    /**
     * @description save created jurisdiction
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      //update location(longitude & latitude) coordinates
      $scope.jurisdiction.location.coordinates[0] =
        $scope.jurisdiction.longitude;
      $scope.jurisdiction.location.coordinates[1] =
        $scope.jurisdiction.latitude;

      var updateOrSave = $scope.jurisdiction.$update();
      if (!$scope.jurisdiction._id) {
        updateOrSave = $scope.jurisdiction.$save();
      }
      updateOrSave.then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Jurisdiction Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:jurisdictions:reload');

          $scope.edit = false;

        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
