'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceGroupIndexCtrl
 * @description
 * # ServiceGroupIndexCtrl
 * ServiceGroup list controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceGroupIndexCtrl', function (
    $rootScope, $scope, $state, ServiceGroup
  ) {

    //groups in the scope
    $scope.spin = false;
    $scope.groups = [];
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
     * @description load groups
     */
    $scope.find = function () {
      //start sho spinner
      $scope.spin = true;

      ServiceGroup.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          name: 1
        },
        query: {},
        q: $scope.q
      }).then(function (response) {
        //update scope with groups when done loading
        $scope.groups = response.groups;
        $scope.total = response.total;
        $scope.spin = false;
      }).catch(function (error) {
        $scope.spin = false;
      });
    };


    //check whether groups will paginate
    $scope.willPaginate = function () {
      var willPaginate =
        ($scope.groups && $scope.total && $scope.total > $scope.limit);
      return willPaginate;
    };


    //pre load groups on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:groups:reload', function () {
      $scope.find();
    });

  });
