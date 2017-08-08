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
  .controller('PriorityShowCtrl', function (
    $rootScope, $scope, $state, $stateParams, Priority
  ) {

    $scope.edit = false;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    $scope.onCancel = function () {
      $scope.edit = false;
      $rootScope.$broadcast('app:priorities:reload');
    };

    $scope.onNew = function () {
      $scope.priority = new Priority({ weight: 0, color: '#FF9800' });
      $scope.edit = true;
    };

    //TODO show empty state if no priority selected
    //listen for selected juridiction
    $rootScope.$on('priority:selected', function (event, priority) {
      $scope.priority = priority;
    });

    /**
     * @description save created priority
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      //try update or save priority
      var updateOrSave =
        (!$scope.priority._id ?
          $scope.priority.$save() : $scope.priority.$update());

      updateOrSave.then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Priority Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:priorities:reload');

          $scope.edit = false;

        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
