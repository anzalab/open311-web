'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:PartyShowCtrl
 * @description
 * # PartyShowCtrl
 * Party show controller of ng311
 */
angular
  .module('ng311')
  .controller('PartyShowCtrl', function (
    $rootScope, $scope, $state, $stateParams, Party,
    jurisdictions
  ) {

    $scope.edit = false;
    $scope.jurisdictions = jurisdictions.jurisdictions;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    $scope.onCancel = function () {
      $scope.edit = false;
    };

    $scope.onNew = function () {
      $scope.party = new Party({});
      $scope.edit = true;
    };

    //TODO show empty state if no party selected
    //listen for selected juridiction
    $rootScope.$on('party:selected', function (event, party) {
      $scope.party = party;
    });

    /**
     * @description save created party
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask
      var updateOrSave = $scope.party.$update();
      if (!$scope.party._id) {
        updateOrSave = $scope.party.$save();
      }
      updateOrSave.then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Party Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:parties:reload');

          $scope.edit = false;

        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
