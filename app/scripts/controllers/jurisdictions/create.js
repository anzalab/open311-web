'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:JurisdictionCreateCtrl
 * @description
 * # JurisdictionCreateCtrl
 * Jurisdiction create controller of ng311
 */
angular
  .module('ng311')
  .controller('JurisdictionCreateCtrl', function (
    $rootScope, $scope, $state, Jurisdiction
  ) {

    //action performed by this controller
    $scope.action = 'Create';

    $scope.edit = true;

    //instantiate new jurisdiction
    $scope.jurisdiction = new Jurisdiction({});


    /**
     * @description save created jurisdiction
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      $scope.jurisdiction.$save().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Jurisdiction Created Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('jurisdiction:create:success');

          $state.go('app.jurisdictions.list');

        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
