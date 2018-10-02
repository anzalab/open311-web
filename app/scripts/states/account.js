'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Account
 * @description billing workflows configurations
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    $stateProvider
      .state('account', {
        abstract: true,
        parent: 'app.create_servicerequests',
        url: '',
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
      .state('account.details', {
        views: {
          "account@": {
            templateUrl: 'views/account/_partials/account_details.html',
            controller: 'AccountIndexCtrl'
          }
        }
      })
      .state('account.accessors', {
        views: {
          "account@": {
            templateUrl: 'views/account/_partials/accessors_list.html',
            controller: 'AccountAccessorsIndexCtrl'
          }
        }
      })
      .state('account.create', {
        params: {
          accessor: null
        },
        views: {
          "account@": {
            templateUrl: 'views/account/_partials/create.html',
            controller: 'AccountAccessorsCreateCtrl'
          }
        }
      });
  });
