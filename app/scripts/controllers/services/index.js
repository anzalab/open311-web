'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceIndexCtrl
 * @description
 * # ServiceIndexCtrl
 * Service list controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceIndexCtrl', function(
    $rootScope,
    $scope,
    $state,
    Service
  ) {
    //services in the scope
    $scope.spin = false;
    $scope.services = [];
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
    $scope.select = function(service) {
      //sort comments in desc order
      if (service && service._id) {
        //update scope service request ref
        $scope.service = service;
        $rootScope.$broadcast('service:selected', service);
      }

      $scope.create = false;
    };

    /**
     * @description load services
     */
    $scope.find = function() {
      //start sho spinner
      $scope.spin = true;

      Service.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          name: 1,
        },
        filter: {},
        q: $scope.q,
      })
        .then(function(response) {
          //update scope with services when done loading
          $scope.services = response.services;
          if ($scope.updated) {
            $scope.updated = false;
          } else {
            $scope.select(_.first($scope.services));
          }
          $scope.total = response.total;
          $scope.spin = false;
        })
        .catch(function(error) {
          $scope.spin = false;
        });
    };

    //check whether services will paginate
    $scope.willPaginate = function() {
      var willPaginate =
        $scope.services && $scope.total && $scope.total > $scope.limit;
      return willPaginate;
    };

    //pre load services on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:services:reload', function() {
      $scope.find();
    });
  });
