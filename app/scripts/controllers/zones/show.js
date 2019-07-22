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

    $scope.onEdit = function() {
      $scope.edit = true;
    };

    $scope.onCancel = function() {
      $scope.edit = false;
      $rootScope.$broadcast('app:zones:reload');
    };

    $scope.onNew = function() {
      $scope.zone = new Zone({});
      $scope.edit = true;
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
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };
  });
