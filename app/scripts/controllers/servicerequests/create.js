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
  .controller('ServiceRequestCreateCtrl', function (
    $rootScope,
    $scope,
    $state,
    $stateParams,
    Account,
    ServiceRequest,
    endpoints,
    party) {

    //action performed by this controller
    $scope.action = 'Create';

    $scope.edit = true;

    $scope.groups = endpoints.servicegroups.servicegroups;
    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
    $scope.services = endpoints.services.services;
    $scope.methods = party.settings.servicerequest.methods;

    //instantiate new servicerequest
    var servicerequest = _.merge({}, {
      _id: ($stateParams || {})._id,
      call: {
        startedAt: new Date()
      },
      method: {
        name: undefined
      },
      reporter: ($stateParams || {}).reporter || {},
      jurisdiction: ($stateParams || {}).jurisdiction,
      service: ($stateParams || {}).service,
      description: ($stateParams || {}).description,
      address: ($stateParams || {}).address,
      method: _.merge({}, { name: undefined }, ($stateParams || {}).method)
    });

    $scope.servicerequest = new ServiceRequest(servicerequest);


    /**
     * @description save created servicerequest
     */
    $scope.save = function () {

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
      var updateOrSave =
        (!$scope.servicerequest._id ?
          $scope.servicerequest.$save() : $scope.servicerequest.$update());

      updateOrSave.then(function (response) {

        response = response || {};

        response.message =
          response.message || 'Service Request Saved Successfully';

        $rootScope.$broadcast('appSuccess', response);

        $rootScope.$broadcast('servicerequest:create:success', response);

        $rootScope.$broadcast('app:servicerequests:reload');

        $state.go('app.servicerequests.list');

      })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
          $rootScope.$broadcast('servicerequest:create:error', error);
        });
    };


    /**
     * @description Launch a customer lookup details in a modal window
     */
    $scope.openLookupModal = function () {

      var accountNumber = $scope.servicerequest.reporter.account;

      Account
        .getDetails(accountNumber)
        .then(function (account) {
          console.log(account);
          $rootScope.account = account;
          $state.go('account.details');
        });
    };

  });
