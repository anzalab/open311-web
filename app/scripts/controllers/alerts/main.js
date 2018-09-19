"use strict";

/**
 * @ngdoc function
 * @name ng311.controller.AlertMainCtrl
 * @description
 * Alert Main Controller
 */
angular
  .module("ng311")
  .controller("AlertMainCtrl", function(
    $rootScope, $scope, $uibModal,
    endpoints, Alert
  ) {
    $scope.page = 1;
    $scope.limit = 10;
    $scope.search = {};
    $scope.channels = [];
    $scope.alert = { jurisdictions: [], methods: [], receivers: [] };

    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
    $scope.methods = [
      { name: "SMS" },
      { name: "Email" },
      { name: "Push Notification" }
    ];

    $scope.priorities = [
      { name: "High", count: 100 },
      { name: "Normal", count: 100 },
      { name: "Low", count: 100 }
    ];

    $scope.statuses = [
      { name: "Sent", count: 100 },
      { name: "Failed", count: 100 },
      { name: "Delivered", count: 100 }
    ];

    $scope.methods = [
      { name: "SMS", count: 100 },
      { name: "Email", count: 100 },
      { name: "Push Notification", count: 100 }
    ];

    $scope.receivers = [
      { name: "Reporters" },
      { name: "Customers" },
      { name: "Subscribers" },
      { name: "Employees" }
    ];

    /**
     * Open model to compose
     *
     * @function
     * @name compose
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.compose = function() {
      //open performance reports filter modal
      $scope.modal = $uibModal.open({
        templateUrl: "views/alerts/_partials/compose.html",
        scope: $scope,
        size: "lg"
      });

      //handle modal close and dismissed
      $scope.modal.result.then(
        function onClose( /*selectedItem*/ ) {},
        function onDismissed() {}
      );
    };

    /**
     * Send composed message
     *
     * @function
     * @name send
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.send = function() {
      // TODO support Email and Push notification
      // normalize input
      // $scope.alert.methods = $scope.channels.map(function(method) {
      //   return method.toUpperCase();
      // });
      $scope.alert.methods = ["SMS"]; // fix SMS as the type of alert that will be sent

      var alert = new Alert($scope.alert);

      console.log($scope.alert);

      // save an alert
      alert
        .$save()
        .then(function( /*response*/ ) {

          $scope.modal.dismiss();

          //TODO avoid collision with alert.message
          var response = {};

          response.message =
            response.message || 'Alert Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('app:alerts:reload');

        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
        });
    };

    /**
     * Load initial alerts on state activation
     *
     * @function
     * @name index
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.find = function() {
      Alert.find({
        page: $scope.page,
        q: $scope.q
      }).then(function(results) {
        $scope.alerts = results.alerts.map(function(alert) {
          var areas = alert.jurisdictions.map(function(jurisdiction) {
            return jurisdiction.name;
          });

          return _.merge({}, alert, { areas: areas.toString() });
        });
        $scope.total = results.total;
      });
    };

    /**
     * Search Alert
     *
     * @function
     * @name onSearch
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.onSearch = function() {
      if ($scope.alerts && $scope.search.q && $scope.search.q.length >= 2) {
        $scope.q = $scope.search.q;
        $scope.find();
      } else {
        $scope.q = undefined;
        $scope.find();
      }
    };

    /**
     * Determine whether to show pagination button
     *
     * @function
     * @name willPaginate
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.willPaginate = function() {
      return $scope.total && $scope.total > $scope.limit;
    };

    // load alerts
    $scope.find();

    //listen for events
    $rootScope.$on('app:alerts:reload', function() {
      $scope.find();
    });

  });
