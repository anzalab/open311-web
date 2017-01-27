'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceGroupMainCtrl
 * @description
 * # ServiceGroupMainCtrl
 * ServiceGroup main controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceGroupMainCtrl', function (
    $rootScope, $scope, $state, prompt, ServiceGroup
  ) {

    //set app to mailbox
    $rootScope.appMailbox = true;

    //hide aside
    $rootScope.showAside = true;


    /**
     * @description delete group
     */
    $scope.delete = function (group) {
      group.$delete()
        .then(function (response) {

          response = response || {};

          response.message =
            response.message || 'Service Group Deleted Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('group:delete:success');


          $state.go('app.groups.list');

        })
        .catch(function (error) {
          if (error) {
            $rootScope.$broadcast('appError', error);
          }
        });
    };

  });
