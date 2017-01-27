'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceMainCtrl
 * @description
 * # ServiceMainCtrl
 * Service main controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceMainCtrl', function (
    $rootScope, $scope, $state, prompt, Service
  ) {

    //set app to mailbox
    $rootScope.appMailbox = true;

    //hide aside
    $rootScope.showAside = true;


    /**
     * @description delete service
     */
    $scope.delete = function (service) {
      service.$delete()
        .then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Service Group Deleted Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('service:delete:success');


          $state.go('app.services.list');

        })
        .catch(function (error) {
          if (error) {
            $rootScope.$broadcast('appError', error);
          }
        });
    };

  });
