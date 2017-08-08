'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:StatusShowCtrl
 * @description
 * # StatusShowCtrl
 * Status show controller of ng311
 */
angular
  .module('ng311')
  .controller('StatusShowCtrl', function (
    $rootScope, $scope, $state, $stateParams, Status
  ) {

    $scope.edit = false;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    $scope.onCancel = function () {
      $scope.edit = false;
      $rootScope.$broadcast('app:statuses:reload');
    };

    $scope.onNew = function () {
      $scope.status = new Status({ weight: 0, color: '#FF9800' });
      $scope.edit = true;
    };

    //TODO show empty state if no status selected
    //listen for selected juridiction
    $rootScope.$on('status:selected', function (event, status) {
      $scope.status = status;
    });

    /**
     * @description save created status
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      //try update or save status
      var updateOrSave =
        (!$scope.status._id ? $scope.status.$save() : $scope.status.$update());

      updateOrSave.then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Status Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:statuses:reload');

          $scope.edit = false;

        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
