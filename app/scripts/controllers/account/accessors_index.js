'use strict';

angular
  .module('ng311')
  .controller('AccountAccessorsIndexCtrl', function ($rootScope, $scope, $state, Account) {

    /* declaration */
    $scope.accessors = $rootScope.account.accessors;
    var account = $rootScope.account;

    /**
     * Open Account details view
     */
    $scope.openAccountDetails = function () { $state.go('accountModal.details'); };


    /**
     * Open a form for creating account accessor
     */
    $scope.addAccessor = function () { $state.go('accountModal.create'); };


    /**
     * Open a form for editing account accessor
     * @param {Object} accessor
     */
    $scope.editAccessor = function (accessor) {
      $state.go('accountModal.create', { accessor: accessor });
    };


    /**
     * Verify account accessor
     * @param {String} phoneNumber
     */
    $scope.verifyAccessor = function (phoneNumber) {

      Account
        .verifyAccessor(account._id, phoneNumber)
        .then(function (account) {
          $rootScope.account = account;
          $scope.accessors = account.accessors;
        });
    };


    /**
     * Remove account accessor
     * @param {String} phoneNumber
     */
    $scope.removeAccessor = function (phoneNumber) {
      Account.deleteAccessor(account._id, phoneNumber)
        .then(function (account) {
          $rootScope.account = account;
          $scope.accessors = account.accessors;
        });
    };
  });
