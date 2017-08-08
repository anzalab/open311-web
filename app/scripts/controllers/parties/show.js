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
    jurisdictions, roles
  ) {

    $scope.edit = false;
    $scope.jurisdictions = jurisdictions.jurisdictions;
    $scope.roles = roles.roles;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    $scope.onCancel = function () {
      $scope.edit = false;
    };

    $scope.onNew = function () {
      $scope.party = new Party({
        roles: [],
        _assigned: []
      });
      $scope.edit = true;
    };

    /**
     * @description block created party
     */
    $scope.block = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.party.deletedAt = new Date();
      $scope.save();
    };


    /**
     * @description unblock created party
     */
    $scope.unblock = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.party.deletedAt = null;
      $scope.save();
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

      //update party assigned roles
      $scope.party.roles = $scope.party._assigned;

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
