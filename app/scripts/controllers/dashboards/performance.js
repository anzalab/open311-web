'use strict';


/**
 * @ngdoc function
 * @name ng311.controller:DashboardPerformanceCtrl
 * @description
 * # DashboardPerformanceCtrl
 * dashboard performance controller of ng311
 */


angular
  .module('ng311')
  .controller('DashboardPerformanceCtrl', function (
    $rootScope, $scope, $state, $uibModal,
    Summary, endpoints, party
  ) {

    //initialize scope attributes
    $scope.maxDate = new Date();

    //bind states
    $scope.priorities = endpoints.priorities.priorities;
    $scope.statuses = endpoints.statuses.statuses;
    $scope.services = endpoints.services.services;
    $scope.servicegroups = endpoints.servicegroups.servicegroups;
    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
    $scope.workspaces = party.settings.party.relation.workspaces;

    //bind filters
    var defaultFilters = {
      // startedAt: moment().utc().startOf('date').toDate(),
      startedAt: moment().utc().startOf('year').toDate(),
      endedAt: moment().utc().endOf('date').toDate(),
      statuses: [],
      priorities: [],
      servicegroups: [],
      jurisdictions: [],
      workspaces: []
    };

    $scope.filters = defaultFilters;

    //initialize performances
    $scope.performances = [];

    /**
     * Open overview reports filter
     */
    $scope.showFilter = function () {

      //open overview reports filter modal
      $scope.modal = $uibModal.open({
        templateUrl: 'views/dashboards/_partials/performances_filter.html',
        scope: $scope,
        size: 'lg',
      });

      //handle modal close and dismissed
      $scope.modal.result.then(function onClose( /*selectedItem*/ ) {},
        function onDismissed() {});

    };


    /**
     * Filter overview reports based on on current selected filters
     * @param {Boolean} [reset] whether to clear and reset filter
     */
    $scope.filter = function (reset) {
      if (reset) {
        $scope.filters = defaultFilters;
      }

      //prepare query
      $scope.params = Summary.prepareQuery($scope.filters);

      //load reports
      $scope.reload();

      //close current modal
      $scope.modal.close();
    };


    /**
     * Filter service based on selected service group
     */
    $scope.filterServices = function () {
      var filterHasServiceGroups =
        ($scope.filters.servicegroups && $scope.filters.servicegroups.length >
          0);
      //pick only service of selected group
      if (filterHasServiceGroups) {
        //filter services based on service group(s)
        $scope.services =
          _.filter(endpoints.services.services, function (service) {
            return _.includes($scope.filters.servicegroups, service.group
              ._id);
          });
      }
      //use all services
      else {
        $scope.services = endpoints.services.services;
      }
    };


    /**
     * Reload overview reports
     */
    $scope.reload = function () {
      Summary
        .performances({ query: $scope.params })
        .then(function (performances) {
          $scope.performances = performances;

          //prepare summary
          $scope.performances.summaries = [{
            name: 'Total',
            count: $scope.performances.total,
            color: '#607D8B'
          }, {
            name: 'Resolved',
            count: $scope.performances.resolved,
            color: '#8BC34A'
          }, {
            name: 'Pending',
            count: $scope.performances.pending,
            color: '#00BCD4'
          }, {
            name: 'Late',
            count: $scope.performances.late,
            color: '#009688'
          }, {
            name: 'Un-Attended',
            count: $scope.performances.unattended,
            color: '#9E9D24'
          }];

        });
    };

    //listen for events and reload overview accordingly
    $rootScope.$on('app:servicerequests:reload', function () {
      $scope.reload();
    });


    //pre-load reports
    //prepare overview details
    $scope.params = Summary.prepareQuery($scope.filters);
    $scope.reload();

  });
