'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:PriorityIndexCtrl
 * @description
 * # PriorityIndexCtrl
 * Priority list controller of ng311
 */
angular
  .module('ng311')
  .controller('PriorityIndexCtrl', function (
    $rootScope, $scope, $state, Priority
  ) {

    //priorities in the scope
    $scope.spin = false;
    $scope.priorities = [];
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
    $scope.select = function (priority) {

      //sort comments in desc order
      if (priority && priority._id) {
        //update scope service request ref
        $scope.priority = priority;
        $rootScope.$broadcast('priority:selected', priority);
      }

      $scope.create = false;

    };


    /**
     * @description load priorities
     */
    $scope.find = function () {
      //start sho spinner
      $scope.spin = true;

      Priority.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          name: 1
        },
        query: {},
        q: $scope.q
      }).then(function (response) {
        //update scope with priorities when done loading
        $scope.priorities = response.priorities;
        if ($scope.updated) {
          $scope.updated = false;
        } else {
          $scope.select(_.first($scope.priorities));
        }
        $scope.total = response.total;
        $scope.spin = false;
      }).catch(function (error) {
        $scope.spin = false;
      });
    };


    //check whether priorities will paginate
    $scope.willPaginate = function () {
      var willPaginate =
        ($scope.priorities && $scope.total && $scope.total > $scope.limit);
      return willPaginate;
    };


    //pre load priorities on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:priorities:reload', function () {
      $scope.find();
    });

  });
