'use strict';

angular
  .module('ng311')
  .controller('AccountAccessorsIndexCtrl', function(
    $rootScope,
    $scope,
    $state,
    Account
  ) {
    /* declaration */
    $scope.accessors = $rootScope.account.accessors;
    var account = $rootScope.account;

    /**
     * Open Account details view
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.openAccountDetails = function() {
      $state.go('account.details');
    };

    /**
     * Open a form for creating account accessor
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.addAccessor = function() {
      $state.go('account.create');
    };

    /**
     * Open a form for editing account accessor
     * @param {Object} accessor
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.editAccessor = function(accessor) {
      $state.go('account.create', { accessor: accessor });
    };

    /**
     * Verify account accessor
     * @param {String} phoneNumber
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.verifyAccessor = function(phoneNumber) {
      Account.verifyAccessor(account._id, phoneNumber).then(function(account) {
        $rootScope.account = account;
        $scope.accessors = account.accessors;
      });
    };

    /**
     * Remove account accessor
     * @param {String} phoneNumber
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.removeAccessor = function(phoneNumber) {
      Account.deleteAccessor(account._id, phoneNumber).then(function(account) {
        $rootScope.account = account;
        $scope.accessors = account.accessors;
      });
    };
  });
