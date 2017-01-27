'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:RoleIndexCtrl
 * @description
 * # RoleIndexCtrl
 * Role list controller of ng311
 */
angular
  .module('ng311')
  .controller('RoleIndexCtrl', function ($rootScope, $scope, $state, Role) {

    //roles in the scope
    $scope.roles = [];
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
     * @description load roles
     */
    $scope.find = function () {
      Role.find({
        page: $scope.page,
        limit: $scope.limit,
        q: $scope.q
      }).then(function (response) {
        //update scope with roles when done loading
        $scope.roles = response.roles;
        $scope.total = response.total;
      });
    };

    //check whether roles will paginate
    $scope.willPaginate = function () {
      var willPaginate =
        ($scope.roles && $scope.total && $scope.total > $scope.limit);
      return willPaginate;
    };


    //pre load roles on state activation
    $scope.find();

  });
