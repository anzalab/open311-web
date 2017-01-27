'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:AuthForgotCtrl
 * @description
 * # AuthForgotCtrl
 * Controller of the ng311
 */
angular
  .module('ng311')
  .controller('AuthForgotCtrl', function ($rootScope, $scope, $state, Party) {

    //recovery email address
    $scope.party = {
      email: ''
    };


    /**
     * @submit forgot password request
     * @return {[type]} [description]
     */
    $scope.forgot = function () {
      Party.requestRecover($scope.party).then(function (response) {
          $rootScope.$broadcast('appSuccess', response);
          $state.go('signin');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
          $state.go('signin');
        });
    }
  });
