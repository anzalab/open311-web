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

    $scope.onEdit = function() {
      $scope.edit = true;
    };

    $scope.onCancel = function() {
      $scope.edit = false;
      $rootScope.$broadcast('app:servicegroups:reload');
    };

    $scope.onNew = function() {
      $scope.servicegroup = new ServiceGroup({});
      $scope.edit = true;
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
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };
  });
