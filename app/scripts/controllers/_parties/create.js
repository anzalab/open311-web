'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:PartyCreateCtrl
 * @description
 * # PartyCreateCtrl
 * Party create controller of ng311
 */
angular
  .module('ng311')
  .controller('PartyCreateCtrl', function ($rootScope, $scope, $state,
    Party, roles) {

    //action performed by this controller
    $scope.action = 'Create';

    $scope.edit = true;
    $scope.roles = roles.roles;

    //instantiate new party
    $scope.party = new Party({
      roles: []
    });


    /**
     * @description save created party
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.party.roles = $scope.party._assigned;

      $scope.party.$save().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'User created successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('party:create:success');

          $state.go('app.parties.list');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
