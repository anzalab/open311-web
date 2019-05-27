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
  .controller('ServiceGroupIndexCtrl', function(
    $rootScope,
    $scope,
    $state,
    ServiceGroup
  ) {
    //groups in the scope
    $scope.spin = false;
    $scope.servicegroups = [];
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
     * set current service request
     */
    $scope.select = function(servicegroup) {
      //sort comments in desc order
      if (servicegroup && servicegroup._id) {
        //update scope service request ref
        $scope.servicegroup = servicegroup;
        $rootScope.$broadcast('servicegroup:selected', servicegroup);
      }

      $scope.create = false;
    };

    /**
     * @description load groups
     */
    $scope.find = function() {
      //start sho spinner
      $scope.spin = true;

      ServiceGroup.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          name: 1,
        },
        query: {},
        q: $scope.q,
      })
        .then(function(response) {
          //update scope with groups when done loading
          $scope.servicegroups = response.servicegroups;
          if ($scope.updated) {
            $scope.updated = false;
          } else {
            $scope.select(_.first($scope.servicegroups));
          }
          $scope.total = response.total;
          $scope.spin = false;
        })
        .catch(function(error) {
          $scope.spin = false;
        });
    };

    //check whether groups will paginate
    $scope.willPaginate = function() {
      var willPaginate =
        $scope.servicegroups && $scope.total && $scope.total > $scope.limit;
      return willPaginate;
    };

    //pre load groups on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:servicegroups:reload', function() {
      $scope.find();
    });
  });
