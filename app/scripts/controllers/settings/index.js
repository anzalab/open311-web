'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:SettingIndexCtrl
 * @description
 * # SettingIndexCtrl
 * Setting list controller of ng311
 */
angular
  .module('ng311')
  .controller('SettingIndexCtrl', function (
    $rootScope, $scope, $state, ENV, Setting
  ) {

    //signal if its editing process
    $scope.edit = false;

    //use only editable properties
    $scope.settings = $rootScope.party.settings || {};


    $scope.onEdit = function () {
      $scope.edit = true;
    };


    $scope.onClose = function () {
      $scope.edit = false;
    };


    /**
     * @description save edited customer
     */
    $scope.save = function () {
      //check if password edited
      var passwordChanged = !!$scope.party.password;

      //TODO show input prompt
      //TODO show loading mask
      Setting.bulkUpdate([$scope.settings])
        .then(function (response) {
          response = response || {};

          //update settings
          var data = response.data || {};
          $rootScope.settings = angular.merge({}, ENV.settings, data);

          response.message =
            response.message ||
            'Application settings updated successfully';

          $scope.edit = false;

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('setting:update:success');

          $state.go('app.settings');
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
          $state.go('app.settings');
        });
    };


  });
