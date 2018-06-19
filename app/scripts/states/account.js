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
      .state('accountModal', {
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
      .state('accountModal.details', {
        views: {
          "account@": {
            templateUrl: 'views/account/_partials/account_details.html',
            controller: 'AccountIndexCtrl'
          }
        }
      })
      .state('accountModal.accessors', {
        views: {
          "account@": {
            templateUrl: 'views/account/_partials/accessors_list.html',
            controller: 'AccountAccessorsIndexCtrl'
          }
        }
      })
      .state('accountModal.create', {
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
