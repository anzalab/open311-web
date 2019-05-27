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
  .controller('RoleIndexCtrl', function($rootScope, $scope, $state, Role) {
    //roles in the scope
    $scope.spin = false;
    $scope.roles = [];
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
    $scope.select = function(role) {
      //sort comments in desc order
      if (role && role._id) {
        //update scope service request ref
        $scope.role = role;

        //deduce assigned roles
        role._assigned = _.map(role.permissions, '_id');

        $rootScope.$broadcast('role:selected', role);
      }

      $scope.create = false;
    };

    /**
     * @description load roles
     */
    $scope.find = function() {
      //start sho spinner
      $scope.spin = true;

      Role.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          name: 1,
        },
        query: {},
        q: $scope.q,
      })
        .then(function(response) {
          //update scope with roles when done loading
          $scope.roles = response.roles;
          if ($scope.updated) {
            $scope.updated = false;
          } else {
            $scope.select(_.first($scope.roles));
          }
          $scope.total = response.total;
          $scope.spin = false;
        })
        .catch(function(error) {
          $scope.spin = false;
        });
    };

    //check whether roles will paginate
    $scope.willPaginate = function() {
      var willPaginate =
        $scope.roles && $scope.total && $scope.total > $scope.limit;
      return willPaginate;
    };

    //pre load roles on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:roles:reload', function() {
      $scope.find();
    });
  });
