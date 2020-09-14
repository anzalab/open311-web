'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:QualityAdvisoryIndexCtrl
 * @description
 * # QualityAdvisoryIndexCtrl
 * QualityAdvisory list controller of ng311
 */
angular
  .module('ng311')
  .controller('QualityAdvisoryIndexCtrl', function(
    $rootScope,
    $scope,
    $state,
    QualityAdvisory
  ) {
    //qualityadvisories in the scope
    $scope.spin = false;
    $scope.qualityadvisories = [];
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
     * set current qualityadvisory request
     */
    $scope.select = function(qualityadvisory) {
      //sort comments in desc order
      if (qualityadvisory && qualityadvisory._id) {
        //update scope qualityadvisory request ref
        $scope.qualityadvisory = qualityadvisory;
        $rootScope.$broadcast('qualityadvisory:selected', qualityadvisory);
      }

      $scope.create = false;
    };

    /**
     * @description load qualityadvisories
     */
    $scope.find = function() {
      //start sho spinner
      $scope.spin = true;

      QualityAdvisory.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          'name.en': 1,
        },
        filter: {},
        q: $scope.q,
      })
        .then(function(response) {
          //update scope with qualityadvisories when done loading
          $scope.qualityadvisories = response.qualityadvisories;
          if ($scope.updated) {
            $scope.updated = false;
          } else {
            $scope.select(_.first($scope.qualityadvisories));
          }
          $scope.total = response.total;
          $scope.spin = false;
        })
        .catch(function(error) {
          $scope.spin = false;
        });
    };

    //check whether qualityadvisories will paginate
    $scope.willPaginate = function() {
      var willPaginate =
        $scope.qualityadvisories && $scope.total && $scope.total > $scope.limit;
      return willPaginate;
    };

    //pre load qualityadvisories on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:qualityadvisories:reload', function() {
      $scope.find();
    });
  });
