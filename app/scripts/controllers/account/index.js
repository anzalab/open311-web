'use strict';

angular
  .module('ng311')
  .controller('AccountIndexCtrl', function ($rootScope, $scope) {
    $scope.account = $rootScope.account;
  });
