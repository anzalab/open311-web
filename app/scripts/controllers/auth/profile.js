'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:AuthProfileCtrl
 * @description
 * # AuthProfileCtrl
 * Controller of the ng311
 */
angular
  .module('ng311')
  .controller('AuthProfileCtrl', function (
    $rootScope, $scope, $state, $auth, Party
  ) {

    //signal if its editing process
    $scope.edit = false;

    $scope.canSave = true;

    $scope.passwordDontMatch = false;

    //use only editable properties
    $scope.party = new Party($rootScope.party);


    $scope.onEdit = function () {
      $scope.edit = true;
    };


    $scope.onClose = function () {
      $scope.edit = false;
    };


    $scope.onConfirmPassword = function () {
      if (!$scope.party.confirm || !$scope.party.password) {
        $scope.passwordDontMatch = false;
      } else {
        $scope.passwordDontMatch = !($scope.party.password === $scope.party
          .confirm);
        $scope.canSave =
          ($scope.party.password.length >= 8) &&
          ($scope.party.password === $scope.party.confirm);
      }
    };


    $scope.onPasswordChange = function () {
      if (!$scope.party.password) {
        $scope.canSave = true;
      } else {
        $scope.canSave =
          ($scope.party.password.length >= 8) &&
          ($scope.party.password === $scope.party.confirm);
      }
    };


    /**
     * @description save edited customer
     */
    $scope.save = function () {
      //check if password edited
      var passwordChanged = !!$scope.party.password;

      //TODO show input prompt
      //TODO show loading mask
      $scope.party.$update().then(function (response) {
          if (passwordChanged) {
            //signout current party
            return $auth.signout();
          } else {
            return response;
          }
        })
        .then(function (response) {
          response = response || {};

          response.message =
            response.message || 'Profile details updated successfully';

          $scope.edit = false;

          $rootScope.$broadcast('appSuccess', response);

          if (passwordChanged) {
            $state.go('signin');
          } else {
            $state.go('app.profile');
          }
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
          $state.go('app.profile');
        });
    };

  });
