'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceTypeIndexCtrl
 * @description
 * # ServiceTypeIndexCtrl
 * ServiceType list controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceTypeIndexCtrl', function(
    $rootScope,
    $scope,
    $state,
    ServiceType
  ) {
    //servicetypes in the scope
    $scope.spin = false;
    $scope.servicetypes = [];
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
     * set current servicetype request
     */
    $scope.select = function(servicetype) {
      //sort comments in desc order
      if (servicetype && servicetype._id) {
        //update scope servicetype request ref
        $scope.servicetype = servicetype;
        $rootScope.$broadcast('servicetype:selected', servicetype);
      }

      $scope.create = false;
    };

    /**
     * @description load servicetypes
     */
    $scope.find = function() {
      //start sho spinner
      $scope.spin = true;

      ServiceType.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          'name.en': 1,
        },
        filter: {},
        q: $scope.q,
      })
        .then(function(response) {
          //update scope with servicetypes when done loading
          $scope.servicetypes = response.servicetypes;
          if ($scope.updated) {
            $scope.updated = false;
          } else {
            $scope.select(_.first($scope.servicetypes));
          }
          $scope.total = response.total;
          $scope.spin = false;
        })
        .catch(function(error) {
          $scope.spin = false;
        });
    };

    //check whether servicetypes will paginate
    $scope.willPaginate = function() {
      var willPaginate =
        $scope.servicetypes && $scope.total && $scope.total > $scope.limit;
      return willPaginate;
    };

    //pre load servicetypes on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:servicetypes:reload', function() {
      $scope.find();
    });
  });
