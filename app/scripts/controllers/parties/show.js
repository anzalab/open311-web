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
  .controller('PartyShowCtrl', function(
    $rootScope,
    $scope,
    Party,
    roles,
    party,
    Jurisdiction,
    Zone
  ) {
    $scope.edit = false;
    $scope.canSave = true;
    $scope.passwordDontMatch = false;
    $scope.roles = roles.roles;

    $scope.workspaces = party.settings.party.relation.workspaces;

    $scope.onEdit = function() {
      $scope.edit = true;
    };

    $scope.onCancel = function() {
      $scope.edit = false;
      $rootScope.$broadcast('app:parties:reload');
    };

    $scope.onNew = function() {
      $scope.party = new Party({
        relation: {},
        roles: [],
        _assigned: [],
      });
      $scope.edit = true;
    };

    /**
     * @description block created party
     */
    $scope.block = function() {
      //TODO show input prompt
      //TODO show loading mask
      $scope.party.deletedAt = new Date();
      $scope.party.lockedAt = new Date();
      $scope.save();
    };

    /**
     * @description unblock created party
     */
    $scope.unblock = function() {
      //TODO show input prompt
      //TODO show loading mask
      //clear soft delete data
      $scope.party.deletedAt = null;

      //clear locking data
      $scope.party.failedAttempts = 0;
      $scope.party.lockedAt = null;
      $scope.party.unlockedAt = null;
      $scope.party.unlockToken = null;
      $scope.party.unlockSentAt = null;
      $scope.party.unlockTokenExpiryAt = null;

      //set password to guest
      //TODO allow password change
      $scope.party.password = 'guest';

      $scope.save();
    };

    //TODO show empty state if no party selected
    //listen for selected juridiction
    $rootScope.$on('party:selected', function(event, party) {
      $scope.party = party;
    });

    /**
     * Listen for password confirmation input changes
     */
    $scope.onConfirmPassword = function() {
      if (!$scope.party.confirm || !$scope.party.password) {
        $scope.passwordDontMatch = false;
      } else {
        $scope.passwordDontMatch = !(
          $scope.party.password === $scope.party.confirm
        );
        $scope.canSave =
          $scope.party.password.length >= 8 &&
          $scope.party.password === $scope.party.confirm;
      }
    };

    /**
     * Listen for password input changes
     */
    $scope.onPasswordChange = function() {
      if (!$scope.party.password) {
        $scope.canSave = true;
      } else {
        $scope.canSave =
          $scope.party.password.length >= 8 &&
          $scope.party.password === $scope.party.confirm;
      }
    };

    /**
     * @function
     * @name searchJurisdictions
     * @description Search jurisdictions by name
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.searchJurisdictions = function(query) {
      return Jurisdiction.find({ q: query }).then(function(response) {
        return response.jurisdictions;
      });
    };

    /**
     * @function
     * @name searchZones
     * @description Search zones by name
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.searchZones = function(query) {
      var filter = {};
      if ($scope.party && $scope.party.jurisdiction) {
        filter.relations = {};
        filter.relations.jurisdiction = $scope.party.jurisdiction._id;
      }
      console.log(filter);
      return Zone.find({ filter: filter, q: query }).then(function(response) {
        return response.zones;
      });
    };

    /**
     * @description save created party
     */
    $scope.save = function() {
      //TODO show input prompt
      //TODO show loading mask

      //update party assigned roles
      $scope.party.roles = $scope.party._assigned;

      //try update or save party
      var updateOrSave = !$scope.party._id
        ? $scope.party.$save()
        : $scope.party.$update();

      updateOrSave
        .then(function(response) {
          response = response || {};

          response.message = response.message || 'Party Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:parties:reload');

          //re-select saved party
          // $rootScope.$broadcast('party:selected', $scope.party);

          $scope.edit = false;
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };
  });
