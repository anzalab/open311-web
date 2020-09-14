'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:ServiceRequestCreateCtrl
 * @description
 * # ServiceRequestCreateCtrl
 * ServiceRequest create controller of ng311
 */
angular
  .module('ng311')
  .controller('ServiceRequestCreateCtrl', function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    Account,
    ServiceRequest,
    endpoints,
    party,
    Jurisdiction,
    Service
  ) {
    //action performed by this controller
    $scope.action = 'Create';

    $scope.edit = true;

    $scope.groups = endpoints.servicegroups.servicegroups;
    $scope.methods = party.settings.servicerequest.webMethods;
    $scope.genders = party.settings.servicerequest.genders;
    // $scope.genders = ['Male', 'Female', 'Unknown'];

    //initialize scope attributes
    $scope.maxDate = new Date();

    //instantiate new service request
    var servicerequest = _.merge(
      {},
      {
        _id: ($stateParams || {})._id,
        call: {
          startedAt: new Date(),
        },
        reporter: ($stateParams || {}).reporter || {},
        jurisdiction: ($stateParams || {}).jurisdiction,
        service: ($stateParams || {}).service,
        description: ($stateParams || {}).description,
        address: ($stateParams || {}).address,
        method: _.merge({}, { name: undefined }, ($stateParams || {}).method),
      }
    );

    $scope.servicerequest = new ServiceRequest(servicerequest);

    /**
     * @description save created servicerequest
     */
    $scope.save = function() {
      $scope.create = false;
      $scope.updated = true;

      //set call end time
      if (!$scope.servicerequest._id) {
        $scope.servicerequest.call.endedAt = new Date();
      }

      //ensure operator on attending
      if (!$scope.servicerequest.operator) {
        $scope.servicerequest.operator = party ? party._id : undefined;
      }

      //try update or save servicerequest
      var updateOrSave = !$scope.servicerequest._id
        ? $scope.servicerequest.$save()
        : $scope.servicerequest.$update();

      updateOrSave
        .then(function(response) {
          response = response || {};

          response.message =
            response.message || 'Service Request Saved Successfully';

          $rootScope.$broadcast('appSuccess', response);

          $rootScope.$broadcast('servicerequest:create:success', response);

          // $rootScope.$broadcast('app:servicerequests:reload');

          $state.go('app.servicerequests.list');
        })
        .catch(function(error) {
          $rootScope.$broadcast('appError', error);
          $rootScope.$broadcast('servicerequest:create:error', error);
        });
    };

    $scope.searchJurisdictions = function(query) {
      return Jurisdiction.find({
        q: query,
        filter: {
          deletedAt: {
            $eq: null,
          },
        },
      }).then(function(response) {
        return response.jurisdictions;
      });
    };

    $scope.searchServices = function(query) {
      return Service.find({
        q: query,
        filter: {
          deletedAt: {
            $eq: null,
          },
        },
      }).then(function(response) {
        return response.services;
      });
    };

    /**
     * @description Launch a customer lookup details in a modal window
     * @function
     * @name openLookModal
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.openLookupModal = function() {
      var accountNumber = $scope.servicerequest.reporter.account;

      Account.getDetails(accountNumber).then(function(account) {
        account = account || {};

        // ensure bill exists
        var bills = _.get(account, 'bills', undefined);

        if (bills) {
          var _bills = _.orderBy(bills, 'period.billedAt', 'desc');
          account = _.merge({}, account, { bills: _bills });

          /* pick closing balance of the latest bill */
          account = _.merge({}, account, {
            closingBalance: _.first(account.bills).balance.close,
          });
        }

        $rootScope.account = account;
        $scope.servicerequest.reporter = _.merge(
          {},
          {
            name: account.name,
            email: account.email,
          },
          $scope.servicerequest.reporter
        );

        $scope.servicerequest.jurisdiction =
          $scope.servicerequest.jurisdiction || account.jurisdiction;
        $scope.servicerequest.address =
          $scope.servicerequest.address || account.address;
        $scope.servicerequest.location = account.location;
        $state.go('account.details');
      });
    };
  });
