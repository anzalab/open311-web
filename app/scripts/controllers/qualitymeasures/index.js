'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:QualityMeasureIndexCtrl
 * @description
 * # QualityMeasureIndexCtrl
 * QualityMeasure list controller of ng311
 */
angular
  .module('ng311')
  .controller('QualityMeasureIndexCtrl', function(
    $rootScope,
    $scope,
    $state,
    QualityMeasure
  ) {
    //qualitymeasures in the scope
    $scope.spin = false;
    $scope.qualitymeasures = [];
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
     * set current qualitymeasure request
     */
    $scope.select = function(qualitymeasure) {
      //sort comments in desc order
      if (qualitymeasure && qualitymeasure._id) {
        //update scope qualitymeasure request ref
        $scope.qualitymeasure = qualitymeasure;
        $rootScope.$broadcast('qualitymeasure:selected', qualitymeasure);
      }

      $scope.create = false;
    };

    /**
     * @description load qualitymeasures
     */
    $scope.find = function() {
      //start sho spinner
      $scope.spin = true;

      QualityMeasure.find({
        page: $scope.page,
        limit: $scope.limit,
        sort: {
          'name.en': 1,
        },
        filter: {},
        q: $scope.q,
      })
        .then(function(response) {
          //update scope with qualitymeasures when done loading
          $scope.qualitymeasures = response.qualitymeasures;
          if ($scope.updated) {
            $scope.updated = false;
          } else {
            $scope.select(_.first($scope.qualitymeasures));
          }
          $scope.total = response.total;
          $scope.spin = false;
        })
        .catch(function(error) {
          $scope.spin = false;
        });
    };

    //check whether qualitymeasures will paginate
    $scope.willPaginate = function() {
      var willPaginate =
        $scope.qualitymeasures && $scope.total && $scope.total > $scope.limit;
      return willPaginate;
    };

    //pre load qualitymeasures on state activation
    $scope.find();

    //listen for events
    $rootScope.$on('app:qualitymeasures:reload', function() {
      $scope.find();
    });
  });
