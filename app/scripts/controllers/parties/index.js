'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:PartyIndexCtrl
 * @description
 * # PartyIndexCtrl
 * Party list controller of ng311
 */
angular
  .module('ng311')
  .controller('PartyIndexCtrl', function (
    $rootScope, $scope, $state, Party) {

    //parties in the scope
    $scope.spin = false;
    $scope.parties = [];
    $scope.page = 1;
    $scope.limit = 3;
    $scope.total = 0;

    $scope.search = {};

    $scope.onSearch = function () {
      if ($scope.search.q && $scope.search.q.length >= 2) {
        $scope.q = $scope.search.q;
        $scope.find();
      } else {
        $scope.q = undefined;
        $scope.find();
      }
    };


    /**
     * @description load parties
     */
    $scope.find = function () {
      //start sho spinner
      $scope.spin = true;

      Party.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          name: 1
        },
        query: {
          'relation.name': 'Internal'
        },
        q: $scope.q
      }).then(function (response) {
        //update scope with parties when done loading
        $scope.parties = response.parties;
        $scope.total = response.total;
        $scope.spin = false;
      }).catch(function (error) {
        $scope.spin = false;
      });
    };


    //check whether parties will paginate
    $scope.willPaginate = function () {
      var willPaginate =
        ($scope.parties && $scope.total && $scope.total > $scope.limit);
      return willPaginate;
    };


    //pre load parties on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:parties:reload', function () {
      $scope.find();
    });

  });
