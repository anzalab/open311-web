'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Billing
 * @description billing workflows configurations
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    $stateProvider
      .state('accountModal', {
        abstract: true,
        parent: 'app.create_servicerequests',
        url: '',
        params: {
          customerAccount: null
        },
        onEnter: ['$uibModal', '$state', function ($uibModal, $state) {
          $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views/account/index.html',
            size: 'lg'
          }).result.finally(function () {
            $state.go('app.create_servicerequests');
          });
        }],
      })
      .state('accountModal.details', {
        views: {
          "account@": {
            templateUrl: 'views/account/_partials/statement.html',
            controller: function ($scope, $stateParams) {
              $scope.customerAccount = $stateParams.customerAccount;
            }
          }
        }
      })
      .state('accountModal.accessors', {
        views: {
          "account@": {
            templateUrl: 'views/account/_partials/accessors_list.html',
            controller: function ($scope, $state, $stateParams) {
              $scope.accessors = $stateParams.customerAccount.accessors;
              $scope.goBack = function () { $state.go('accountModal.details'); };
              $scope.addAccessor = function () { $state.go('accountModal.create'); };
              $scope.editAccessor = function () { };
              $scope.removeAccessor = function () { };
            },
          }
        }
      })
      .state('accountModal.create', {
        views: {
          "account@": {
            templateUrl: 'views/account/_partials/create.html',
            controller: function ($scope, $state) {
              $scope.goBack = function () { $state.go('accountModal.accessors'); };
            }
          }
        }
      });
  });
