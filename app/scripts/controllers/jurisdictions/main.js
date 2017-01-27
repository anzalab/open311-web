'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:JurisdictionMainCtrl
 * @description
 * # JurisdictionMainCtrl
 * Jurisdiction main controller of ng311
 */
angular
  .module('ng311')
  .controller('JurisdictionMainCtrl', function (
    $rootScope, $scope, $state, prompt, Jurisdiction
  ) {

    //set app to mailbox
    $rootScope.appMailbox = true;

    //hide aside
    $rootScope.showAside = true;


    /**
     * @description delete jurisdiction
     */
    $scope.delete = function (jurisdiction) {
      jurisdiction.$delete()
        .then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Jurisdiction Deleted Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('jurisdiction:delete:success');


          $state.go('app.jurisdictions.list');

        })
        .catch(function (error) {
          if (error) {
            $rootScope.$broadcast('appError', error);
          }
        });
    };

  });
