'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:AuthChangeCtrl
 * @description
 * # AuthChangeCtrl
 * Controller of the ng311
 */
angular
  .module('ng311')
  .controller('AuthChangeCtrl', function ($rootScope, $scope, $state, $auth,
    Party) {

    //new party password
    $scope.party = {
      _id: $rootScope.party._id,
      password: ''
    };

    /**
     * @submit password change request
     * @return {[type]} [description]
     */
    $scope.change = function () {
      //update current party password
      Party.change($scope.party).then(function (response) {
          //signout current party
          $auth.signout().then(function () {
            //notify
            $rootScope.$broadcast('appSuccess', response);
            $state.go('signin');

          });
        })
        .catch(function (error) {
          //notify error
          $rootScope.$broadcast('appError', error);
          $state.go('app.home');
        });
    }

  });
