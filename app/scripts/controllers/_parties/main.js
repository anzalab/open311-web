'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:PartyMainCtrl
 * @description
 * # PartyMainCtrl
 * Party main controller of ng311
 */
angular
  .module('ng311')
  .controller('PartyMainCtrl', function ($rootScope, $scope,
    $state, prompt, Party) {

    //set app to mailbox
    $rootScope.appMailbox = true;

    //hide aside
    $rootScope.showAside = true;


    /**
     * @description delete party
     */
    $scope.delete = function (party) {
      prompt({
          title: 'User Delete',
          message: 'Are you sure, you want to permanently delete this user?'
        }).then(function () {
          return party.$delete();
        })
        .then(function (response) {

          response = response || {};

          response.message =
            response.message || 'User deleted successfully';

          $rootScope.$broadcast('appSuccess', response);

          $state.go('app.parties.list');

        })
        .catch(function (error) {
          if (error) {
            $rootScope.$broadcast('appError', error);
          }
        });
    };

  });
