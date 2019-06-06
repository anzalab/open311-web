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

    $scope.onEdit = function() {
      $scope.edit = true;
    };

    $scope.onCancel = function() {
      $scope.edit = false;
      $rootScope.$broadcast('app:items:reload');
    };

    $scope.onNew = function() {
      $scope.item = new Item({});
      $scope.edit = true;
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
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };
  });
