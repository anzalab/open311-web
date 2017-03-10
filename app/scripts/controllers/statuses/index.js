'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:StatusIndexCtrl
 * @description
 * # StatusIndexCtrl
 * Status list controller of ng311
 */
angular
  .module('ng311')
  .controller('StatusIndexCtrl', function (
    $rootScope, $scope, $state, Status
  ) {

    //statuses in the scope
    $scope.spin = false;
    $scope.statuses = [];
    $scope.page = 1;
    $scope.limit = 10;
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
     * set current service request
     */
    $scope.select = function (status) {

      //sort comments in desc order
      if (status && status._id) {
        //update scope service request ref
        $scope.status = status;
        $rootScope.$broadcast('status:selected', status);
      }

      $scope.create = false;

    };


    /**
     * @description load statuses
     */
    $scope.find = function () {
      //start sho spinner
      $scope.spin = true;

      Status.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          name: 1
        },
        query: {},
        q: $scope.q
      }).then(function (response) {
        //update scope with statuses when done loading
        $scope.statuses = response.statuses;
        if ($scope.updated) {
          $scope.updated = false;
        } else {
          $scope.select(_.first($scope.statuses));
        }
        $scope.total = response.total;
        $scope.spin = false;
      }).catch(function (error) {
        $scope.spin = false;
      });
    };


    //check whether statuses will paginate
    $scope.willPaginate = function () {
      var willPaginate =
        ($scope.statuses && $scope.total && $scope.total > $scope.limit);
      return willPaginate;
    };


    //pre load statuses on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:statuses:reload', function () {
      $scope.find();
    });

  });
