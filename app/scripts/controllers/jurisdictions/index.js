'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:JurisdictionIndexCtrl
 * @description
 * # JurisdictionIndexCtrl
 * Jurisdiction list controller of ng311
 */
angular
  .module('ng311')
  .controller('JurisdictionIndexCtrl', function(
    $rootScope,
    $scope,
    $state,
    Jurisdiction
  ) {
    //jurisdictions in the scope
    $scope.spin = false;
    $scope.jurisdictions = [];
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
    $scope.select = function(jurisdiction) {
      //sort comments in desc order
      if (jurisdiction && jurisdiction._id) {
        //update scope service request ref
        $scope.jurisdiction = jurisdiction;
        $rootScope.$broadcast('jurisdiction:selected', jurisdiction);
      }

      $scope.create = false;
    };

    /**
     * @description load jurisdictions
     */
    $scope.find = function() {
      //start show spinner
      $scope.spin = true;

      Jurisdiction.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          updatedAt: -1,
          name: 1,
        },
        filter: {},
        q: $scope.q,
      })
        .then(function(response) {
          //update scope with jurisdictions when done loading
          $scope.jurisdictions = response.jurisdictions;
          if ($scope.updated) {
            $scope.updated = false;
          } else {
            $scope.select(_.first($scope.jurisdictions));
          }
          $scope.total = response.total;
          $scope.spin = false;
        })
        .catch(function(error) {
          $scope.spin = false;
        });
    };

    //check whether jurisdictions will paginate
    $scope.willPaginate = function() {
      var willPaginate =
        $scope.jurisdictions && $scope.total && $scope.total > $scope.limit;
      return willPaginate;
    };

    //pre load jurisdictions on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:jurisdictions:reload', function() {
      $scope.find();
    });
  });
