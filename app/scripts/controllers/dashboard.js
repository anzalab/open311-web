'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the ng311
 */
angular
  .module('ng311')
  .controller('DashboardCtrl', function ($rootScope, $scope, $http, $log, Utils) {
    //drm analytics
    $scope.analytics = {};

    $scope.loadAnalytics = function () {
      $http
        .get(Utils.asLink(['analytics']))
        .then(function (summary) {
          $scope.summary = summary.data;
          $scope.prepareCounts();
          $scope.prepareCustomerSegmentation();
          $scope.prepareBillSummary();
          $scope.prepareTotalSalesPerProduct();
          $scope.prepareTotalSalesPerLicence();
          $scope.prepareEntitlementCountPerProduct();
          $scope.prepareEntitlementCountPerLicence();
          $scope.prepareActivationCountPerProduct();
          $scope.prepareActivationCountPerLicence();
          $log.info('dashboard:loadSummary:success');
        }).catch(function (error) {
          $log.error('dashboard:loadSummary:error', error);
        });
    };

    //general summary
    $scope.prepareCounts = function () {
      var counts = $scope.summary.counts || {};
      $scope.counts = [
        { x: 'Customers', y: counts.customers || 0 },
        { x: 'Products', y: counts.products || 0 },
        { x: 'Product Features', y: (counts.features || {}).product || 0 },
        { x: 'Licences', y: counts.licences || 0 },
        { x: 'Licence Features', y: (counts.features || {}).licence || 0 },
        { x: 'Entitlements', y: counts.entitlements || 0 },
        { x: 'Bills', y: counts.bills || 0 },
        { x: 'Activations', y: counts.activations || 0 },
        { x: 'Cash Receipts', y: counts.receipts || 0 },
        { x: 'Issued Licences', y: counts.renewals || 0 }
      ];
    };


    //bill summary
    $scope.prepareBillSummary = function () {
      var billSummary = $scope.summary.billSummary || {};
      $scope.billSummary = [{
        label: 'Paid',
        value: billSummary.paid || 0
      }, {
        label: 'Remain',
        value: billSummary.remain || 0
      }];
    };

    //customer segmentation
    $scope.prepareCustomerSegmentation = function () {
      $scope.customerSegmentation = _.map($scope.summary.customerSegmentation,
        function (segment) {
          segment.label = segment.name;
          segment.value = segment.count;
          return segment;
        });
    };

    $scope.prepareTotalSalesPerProduct = function () {
      $scope.totalSalesPerProduct = _.map($scope.summary.totalSalesPerProduct,
        function (sale) {
          sale.label = sale.product;
          sale.value = sale.total;
          return sale;
        });
    };

    $scope.prepareTotalSalesPerLicence = function () {
      $scope.totalSalesPerLicence = _.map($scope.summary.totalSalesPerLicence,
        function (sale) {
          sale.label = sale.licence;
          sale.value = sale.total;
          return sale;
        });
    };


    $scope.prepareEntitlementCountPerProduct = function () {
      $scope.entitlementCountPerProduct = _.map($scope.summary.entitlementCountPerProduct,
        function (entitlement) {
          entitlement.label = entitlement.product;
          entitlement.value = entitlement.count;
          return entitlement;
        });
    };


    $scope.prepareEntitlementCountPerLicence = function () {
      $scope.entitlementCountPerLicence = _.map($scope.summary.entitlementCountPerLicence,
        function (entitlement) {
          entitlement.label = entitlement.licence;
          entitlement.value = entitlement.count;
          return entitlement;
        });
    };

    $scope.prepareActivationCountPerProduct = function () {
      $scope.activationCountPerProduct = _.map($scope.summary.activationCountPerProduct,
        function (activation) {
          activation.label = activation.product;
          activation.value = activation.count;
          return activation;
        });
    };


    $scope.prepareActivationCountPerLicence = function () {
      $scope.activationCountPerLicence = _.map($scope.summary.activationCountPerLicence,
        function (activation) {
          activation.label = activation.licence;
          activation.value = activation.count;
          return activation;
        });
    };


    $rootScope.showAside = true;

    //load analytics
    $scope.loadAnalytics();

    //listen for events and reload analytics
    $rootScope.$on('setting:update:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('product:create:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('product:update:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('entitlment:create:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('entitlment:update:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('feature:create:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('feature:update:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('party:create:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('party:update:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('licence:create:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('licence:update:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('activation:create:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('activation:update:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('bill:create:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('bill:update:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('receipt:create:success', function () {
      $scope.loadAnalytics();
    });

    $rootScope.$on('receipt:update:success', function () {
      $scope.loadAnalytics();
    });

  });
