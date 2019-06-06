'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the ng311
 */
angular
  .module('ng311')
  .controller('AppCtrl', function($rootScope, $scope, ENV, party) {
    //show app aside
    $rootScope.showAside = true;

    //adding current party into root scope and scope
    //so that it can be accessed in views and controllers
    $rootScope.party = party;
    $scope.party = $rootScope.party;

    //adding current applycation setting into root scope and scope
    //so that it can be accessed in views and controllers
    $rootScope.settings = angular.merge({}, ENV.settings, party.settings);
    $scope.settings = $rootScope.settings;

    $scope.$watch('$root.settings', function() {
      $scope.settings = $rootScope.settings;
    });
  });
