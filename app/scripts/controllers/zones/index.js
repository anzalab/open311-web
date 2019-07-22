'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ZoneIndexCtrl
 * @description
 * # ZoneIndexCtrl
 * Zone list controller of ng311
 */
angular
  .module('ng311')
  .controller('ZoneIndexCtrl', function($rootScope, $scope, $state, Zone) {
    //zones in the scope
    $scope.spin = false;
    $scope.zones = [];
    $scope.page = 1;
    $scope.limit = 10;
    $scope.total = 0;

    $scope.search = {};

    $scope.onSearch = function() {
      if ($scope.search.q && $scope.search.q.length >= 2) {
        $scope.q = $scope.search.q;
        $scope.find();
      } else {
        $scope.q = undefined;
        $scope.find();
      }
    };

    /**
     * set current zone request
     */
    $scope.select = function(zone) {
      //sort comments in desc order
      if (zone && zone._id) {
        //update scope zone request ref
        $scope.zone = zone;
        $rootScope.$broadcast('zone:selected', zone);
      }

      $scope.create = false;
    };

    /**
     * @description load zones
     */
    $scope.find = function() {
      //start sho spinner
      $scope.spin = true;

      Zone.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          name: 1,
        },
        filter: {},
        q: $scope.q,
      })
        .then(function(response) {
          //update scope with zones when done loading
          $scope.zones = response.zones;
          if ($scope.updated) {
            $scope.updated = false;
          } else {
            $scope.select(_.first($scope.zones));
          }
          $scope.total = response.total;
          $scope.spin = false;
        })
        .catch(function(error) {
          $scope.spin = false;
        });
    };

    //check whether zones will paginate
    $scope.willPaginate = function() {
      var willPaginate =
        $scope.zones && $scope.total && $scope.total > $scope.limit;
      return willPaginate;
    };

    //pre load zones on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:zones:reload', function() {
      $scope.find();
    });
  });
