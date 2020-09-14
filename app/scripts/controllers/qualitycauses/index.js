'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:QualityCauseIndexCtrl
 * @description
 * # QualityCauseIndexCtrl
 * QualityCause list controller of ng311
 */
angular
  .module('ng311')
  .controller('QualityCauseIndexCtrl', function(
    $rootScope,
    $scope,
    $state,
    QualityCause
  ) {
    //qualitycauses in the scope
    $scope.spin = false;
    $scope.qualitycauses = [];
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
     * set current qualitycause request
     */
    $scope.select = function(qualitycause) {
      //sort comments in desc order
      if (qualitycause && qualitycause._id) {
        //update scope qualitycause request ref
        $scope.qualitycause = qualitycause;
        $rootScope.$broadcast('qualitycause:selected', qualitycause);
      }

      $scope.create = false;
    };

    /**
     * @description load qualitycauses
     */
    $scope.find = function() {
      //start sho spinner
      $scope.spin = true;

      QualityCause.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          'name.en': 1,
        },
        filter: {},
        q: $scope.q,
      })
        .then(function(response) {
          //update scope with qualitycauses when done loading
          $scope.qualitycauses = response.qualitycauses;
          if ($scope.updated) {
            $scope.updated = false;
          } else {
            $scope.select(_.first($scope.qualitycauses));
          }
          $scope.total = response.total;
          $scope.spin = false;
        })
        .catch(function(error) {
          $scope.spin = false;
        });
    };

    //check whether qualitycauses will paginate
    $scope.willPaginate = function() {
      var willPaginate =
        $scope.qualitycauses && $scope.total && $scope.total > $scope.limit;
      return willPaginate;
    };

    //pre load qualitycauses on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:qualitycauses:reload', function() {
      $scope.find();
    });
  });
