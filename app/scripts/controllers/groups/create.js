'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceGroupCreateCtrl
 * @description
 * # ServiceGroupCreateCtrl
 * ServiceGroup create controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceGroupCreateCtrl', function (
    $rootScope, $scope, $state, ServiceGroup
  ) {

    //action performed by this controller
    $scope.action = 'Create';

    $scope.edit = true;

    //instantiate new group
    $scope.group = new ServiceGroup({});


    /**
     * @description save created group
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask

      $scope.group.$save().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Service Group Created Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('group:create:success');

          $state.go('app.groups.list');

        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
        });
    };

  });
