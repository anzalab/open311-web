'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:AuthRecoverCtrl
 * @description
 * # AuthRecoverCtrl
 * Controller of the ng311
 */
angular
  .module('ng311')
  .controller('AuthRecoverCtrl', function ($rootScope, $scope, $state,
    $stateParams, Party) {

    //new party password
    $scope.party = {
      token: $stateParams.token,
      password: ''
    };


    /**
     * @submit recover party password
     * @return {[type]} [description]
     */
    $scope.recover = function () {
      //update current party password
      Party.recover($scope.party).then(function (response) {
        $rootScope.$broadcast('appSuccess', response);
        $state.go('signin');
      }).catch(function (error) {
        $rootScope.$broadcast('appError', error);
        $state.go('signin');
      });
    }

  });
