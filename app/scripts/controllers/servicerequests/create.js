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
    $uibModal,
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
      method: ($stateParams || {}).method
    });

    $scope.servicerequest = new ServiceRequest(servicerequest);

    $scope.customerDetails = {
      number: '124352',
      name: 'Lally Elias',
      phone: '255714095',
      email: 'lally@example.com',
      contacts: [{
        phone: '255714095',
        email: 'l@eg.com',
        verified: true
      }],
      address: 'Ilala / Ubungo / Mabibo',
      fullAddress: 'Ilala - Upanga - Mabibo',
      area: 'Ilala',
      neighborhood: 'Upanga',
      location: {
        longitude: 39.276638,
        latitude: -6.81633
      },
      bills: [{
          number: '53652323',
          period: {
            name: 'January 2018',
            endedAt: '2018-01-30',
            duedAt: '2018-01-31'
          },
          balance: {
            current: 9000,
            open: 5000,
            charges: 3000,
            loan: 1000
          },
          items: [{
              name: 'Previous Readings',
              quantity: '71',
              units: 'cbm'
            },
            {
              name: 'Current Readings',
              quantity: '74',
              units: 'cbm'
            },
            {
              name: 'Unit Consumed',
              quantity: '3',
              units: 'cbm'
            }
          ]
        },
        {
          number: '53652323',
          period: {
            name: 'December 2017',
            startedAt: '2017-12-01',
            endedAt: '2017-12-30',
            duedAt: '2017-12-31'
          },
          balance: {
            outstand: 9000,
            open: 5000,
            charges: 3000,
            close: 9000,
            debt: 1000
          },
          items: [{
              time: '2017-12-31',
              name: 'Previous Readings',
              quantity: '71',
              units: 'cbm'
            },
            {
              time: '2017-12-31',
              name: 'Current Readings',
              quantity: '74',
              units: 'cbm'
            },
            {
              time: '2017-12-31',
              name: 'Unit Consumed',
              quantity: '3',
              units: 'cbm'
            }
          ]
        }
      ],
      active: true
    };

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

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/servicerequests/_partials/customer_details.html',
        size: 'lg',
        scope: $scope,
        controller: function () {},
        resolve: {
          items: function () {}
        }
      });
    };

  });
