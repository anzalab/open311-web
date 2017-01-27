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
  .controller('PartyShowCtrl', function ($rootScope, $scope, $state,
    $stateParams, Party, roles, $timeout) {

    $scope.edit = false;
    $scope.roles = roles.roles;

    $scope.onEdit = function () {
      $scope.edit = true;
    };

    //load party
    Party.get({
      id: $stateParams.id
    }).$promise.then(function (party) {
      party._roles = _.map(party.roles, 'name').join(', ');
      party._assigned = _.map(party.roles, '_id');
      $scope.party = party;
    });


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

    /**
     * @description save created party
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.party.roles = $scope.party._assigned;

      $scope.party.$update().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'User updated successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('party:update:success');

          $state.go('app.parties.list');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
