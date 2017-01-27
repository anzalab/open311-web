'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceCreateCtrl
 * @description
 * # ServiceCreateCtrl
 * Service create controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceCreateCtrl', function (
    $rootScope, $scope, $state, Service
  ) {

    //action performed by this controller
    $scope.action = 'Create';

    $scope.edit = true;

    //instantiate new service
    $scope.service = new Service({});


    /**
     * @description save created service
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      $scope.service.$save().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Service Created Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('service:create:success');

          $state.go('app.services.list');

        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
