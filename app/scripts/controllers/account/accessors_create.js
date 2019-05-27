'use strict';

angular
  .module('ng311')
  .controller('AccountAccessorsCreateCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    Account
  ) {
    var isEdit = $stateParams.accessor || false;
    $scope.accessor = $stateParams.accessor || {};
    $scope.title = $stateParams.accessor ? 'Edit' : 'New';

    /**
     * Navigate back to accessor list
     * @function
     * @name openAccessorList
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.openAccessorList = function() {
      $state.go('account.accessors');
    };

    /**
     * Create a new accessor in account
     * @function
     * @name addAccessor
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.addAccessor = function() {
      var account = $rootScope.account;

      if (isEdit) {
        Account.updateAccessor(
          account._id,
          $scope.accessor.phone,
          $scope.accessor
        )
          .then(function(account) {
            $rootScope.account = account;
            $scope.openAccessorList();
          })
          .catch(function(/*error*/) {
            // Handle error here
          });
      } else {
        Account.addAccessor(account._id, $scope.accessor)
          .then(function(account) {
            $rootScope.account = account;
            $scope.openAccessorList();
          })
          .catch(function(/*error*/) {});
      }
    };
  });
