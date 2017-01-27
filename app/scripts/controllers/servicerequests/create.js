'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceRequestCreateCtrl
 * @description
 * # ServiceRequestCreateCtrl
 * ServiceRequest create controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceRequestCreateCtrl', function ($rootScope, $scope, $state,
    ServiceRequest) {

    //action performed by this controller
    $scope.action = 'Create';

    $scope.edit = true;
    $scope.roles = roles.roles;

    //instantiate new servicerequest
    $scope.servicerequest = new ServiceRequest({});


    /**
     * @description save created servicerequest
     */
    $scope.save = function () {
      //TODO show input prompt
      //TODO show loading mask
      $scope.servicerequest.roles = $scope.servicerequest._assigned;

      $scope.servicerequest.$save().then(function (response) {

          response = response || {};

          response.message =
            response.message || 'ServiceRequest created successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('servicerequest:create:success', response);

          $rootScope.$broadcast('app:servicerequests:reload');

          $state.go('app.servicerequests.list');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
          $rootScope.$broadcast('servicerequest:create:error', error);
        });
    };

  });
