'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceRequestIndexCtrl
 * @description
 * # ServiceRequestIndexCtrl
 * ServiceRequest list controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceRequestIndexCtrl', function (
    $rootScope, $scope, $state, ServiceRequest) {

    //servicerequests in the scope
    $scope.spin = false;
    $scope.servicerequests = [];
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
     * @description load servicerequests
     */
    $scope.find = function () {
      //start sho spinner
      $scope.spin = true;

      ServiceRequest.find({
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
        //update scope with servicerequests when done loading
        $scope.servicerequests = response.servicerequests;
        $scope.total = response.total;
        $scope.spin = false;
      }).catch(function (error) {
        $scope.spin = false;
      });
    };


    //check whether servicerequests will paginate
    $scope.willPaginate = function () {
      var willPaginate =
        ($scope.servicerequests && $scope.total && $scope.total > $scope.limit);
      return willPaginate;
    };


    //pre load servicerequests on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:servicerequests:reload', function () {
      $scope.find();
    });

  });
