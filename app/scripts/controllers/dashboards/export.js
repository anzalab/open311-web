'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:DashboardExportCtrl
 * @description
 * # DashboardExportCtrl
 * dashboard service requesr bulk export controller of ng311
 */
angular
  .module('ng311')
  .controller('DashboardExportCtrl', function(
    $window,
    $location,
    $rootScope,
    $scope,
    $state,
    Utils,
    Summary,
    endpoints,
    token,
    party
  ) {
    //initialize scope attributes
    $scope.maxDate = new Date();

    //bind states
    $scope.priorities = endpoints.priorities.priorities;
    $scope.statuses = endpoints.statuses.statuses;
    $scope.services = endpoints.services.services;
    $scope.servicegroups = endpoints.servicegroups.servicegroups;
    $scope.servicetypes = endpoints.servicetypes.data;
    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
    $scope.workspaces = party.settings.party.relation.workspaces;
    $scope.methods = party.settings.servicerequest.methods;

    //bind filters
    var defaultFilters = {
      startedAt: moment()
        .utc()
        .startOf('date')
        .toDate(),
      endedAt: moment()
        .utc()
        .endOf('date')
        .toDate(),
      statuses: [],
      priorities: [],
      servicegroups: [],
      servicetypes: [],
      jurisdictions: [],
      workspaces: [],
      methods: [],
    };

    $scope.filters = defaultFilters;

    /**
     * Filter overview reports based on on current selected filters
     * @param {Boolean} [reset] whether to clear and reset filter
     */
    $scope.export = function(reset) {
      if (reset) {
        $scope.filters = defaultFilters;
        return;
      } else {
        //prepare query
        $scope.params = Summary.prepareQuery($scope.filters);

        //load reports
        $scope.download();
      }
    };

    /**
     * Filter service based on selected service group
     */
    $scope.filterServices = function() {
      var filterHasServiceGroups =
        $scope.filters.servicegroups && $scope.filters.servicegroups.length > 0;
      //pick only service of selected group
      if (filterHasServiceGroups) {
        //filter services based on service group(s)
        $scope.services = _.filter(endpoints.services.services, function(
          service
        ) {
          return _.includes($scope.filters.servicegroups, service.group._id);
        });
      }
      //use all services
      else {
        $scope.services = endpoints.services.services;
      }
    };

    /**
     * download service requests
     */
    $scope.download = function() {
      var link = Utils.asLink(['reports', 'exports']);
      link = link + '?filter=' + angular.toJson($scope.params);
      link = link + '&token=' + token;
      $window.open(link, '_blank');
    };
  });
