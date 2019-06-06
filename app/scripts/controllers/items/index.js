'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ItemIndexCtrl
 * @description
 * # ItemIndexCtrl
 * Item list controller of ng311
 */
angular
  .module('ng311')
  .controller('ItemIndexCtrl', function($rootScope, $scope, $state, Item) {
    //items in the scope
    $scope.spin = false;
    $scope.items = [];
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
     * set current item request
     */
    $scope.select = function(item) {
      //sort comments in desc order
      if (item && item._id) {
        //update scope item request ref
        $scope.item = item;
        $rootScope.$broadcast('item:selected', item);
      }

      $scope.create = false;
    };

    /**
     * @description load items
     */
    $scope.find = function() {
      //start sho spinner
      $scope.spin = true;

      Item.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          name: 1,
        },
        filter: {},
        q: $scope.q,
      })
        .then(function(response) {
          //update scope with items when done loading
          $scope.items = response.items;
          if ($scope.updated) {
            $scope.updated = false;
          } else {
            $scope.select(_.first($scope.items));
          }
          $scope.total = response.total;
          $scope.spin = false;
        })
        .catch(function(error) {
          $scope.spin = false;
        });
    };

    //check whether items will paginate
    $scope.willPaginate = function() {
      var willPaginate =
        $scope.items && $scope.total && $scope.total > $scope.limit;
      return willPaginate;
    };

    //pre load items on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:items:reload', function() {
      $scope.find();
    });
  });
