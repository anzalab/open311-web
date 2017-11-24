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
    $rootScope, $scope, $state, $filter, $stateParams, $uibModal,
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

    //set default jurisdiction
    $scope.jurisdiction =
      ($stateParams.jurisdiction || _.first($scope.jurisdictions));

    console.log($stateParams);
    //bind filters
    var defaultFilters = {
      // startedAt: moment().utc().startOf('date').toDate(),
      startedAt: ($stateParams.startedAt || moment().utc().startOf('year').toDate()),
      endedAt: ($stateParams.endedAt || moment().utc().endOf('date').toDate()),
      jurisdictions: [].concat($scope.jurisdiction._id),
      workspaces: []
    };

    $scope.filters = defaultFilters;

    //initialize performances
    $scope.performances = [];

    /**
     * Open performance reports filter
     */
    $scope.showFilter = function () {

      //open performance reports filter modal
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
     * Filter performance reports based on on current selected filters
     * @param {Boolean} [reset] whether to clear and reset filter
     */
    $scope.filter = function (reset) {
      if (reset) {
        $scope.filters = defaultFilters;
      }

      //prepare query
      $scope.params = Summary.prepareQuery($scope.filters);

      //reset area
      var _id = _.first($scope.filters.jurisdictions);
      $scope.jurisdiction = _.find($scope.jurisdictions, {
        '_id': _id
      });

      //load reports
      $scope.reload();

      //close current modal
      $scope.modal.close();
    };

    //prepare summaries
    //TODO make api to return data
    $scope.prepareSummaries = function () {
      //prepare summary
      $scope.performances.summaries = [{
        name: 'Resolved',
        count: $scope.performances.overall.resolved,
        color: '#8BC34A'
      }, {
        name: 'Pending',
        count: $scope.performances.overall.pending,
        color: '#00BCD4'
      }, {
        name: 'Late',
        count: $scope.performances.overall.late,
        color: '#009688'
      }, {
        name: 'Un-Attended',
        count: $scope.performances.overall.unattended,
        color: '#9E9D24'
      }];
    };

    $scope.prepare = function () {

      //shaping data
      $scope.prepareSummaries();

      //prepare visualization
      $scope.prepareSummaryVisualization();
      $scope.prepareStatusesVisualization();
      $scope.prepareServiceGroupVisualization();

    };


    /**
     * Reload performance reports
     */
    $scope.reload = function () {
      Summary
        .performances({
          query: $scope.params
        })
        .then(function (performances) {

          $scope.performances = performances;

          //ensure status are sorted by weight
          $scope.performances.statuses =
            _.orderBy(performances.statuses, 'weight', 'asc');

          $scope.prepare();

        });
    };

    /**
     * prepare summary visualization
     * @return {object} echart donut chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareSummaryVisualization = function () {

      //prepare chart series data
      var data = _.map($scope.performances.summaries, function (summary) {
        return {
          name: summary.name,
          value: summary.count
        };
      });

      //prepare chart config
      $scope.perSummaryConfig = {
        height: 400,
        forceClear: true
      };

      //prepare chart options
      $scope.perSummaryOptions = {
        textStyle: {
          fontFamily: 'Lato'
        },
        title: {
          text: 'Total',
          subtext: $filter('number')(_.sumBy(data, 'value'), 0),
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: "{b}:<br/> Count: {c} <br/> Percent: ({d}%)"
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Area Overview - ' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        },
        series: [{
          type: 'pie',
          selectedMode: 'single',
          radius: ['45%', '55%'],
          color: _.map($scope.performances.summaries, 'color'),
          label: {
            normal: {
              formatter: '{b}\n{d}%',
            }
          },
          data: data
        }]
      };

    };

    /**
     * prepare statuses visualization
     * @return {object} echart donut chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareStatusesVisualization = function () {

      //prepare chart series data
      var data = _.map($scope.performances.statuses, function (status) {
        return {
          name: status.name,
          value: status.count
        };
      });

      //prepare chart config
      $scope.perStatusesConfig = {
        height: 400,
        forceClear: true
      };

      //prepare chart options
      $scope.perStatusesOptions = {
        textStyle: {
          fontFamily: 'Lato'
        },
        title: {
          text: 'Total',
          subtext: $filter('number')(_.sumBy(data, 'value'), 0),
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: "{b}:<br/> Count: {c} <br/> Percent: ({d}%)"
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Area Status Overview - ' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        },
        series: [{
          type: 'pie',
          selectedMode: 'single',
          radius: ['45%', '55%'],
          color: _.map($scope.performances.statuses, 'color'),
          label: {
            normal: {
              formatter: '{b}\n{d}%',
            }
          },
          data: data
        }]
      };

    };

    /**
     * prepare service group performance visualization
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareServiceGroupVisualization = function (column) {

      //ensure column
      column = column || 'count';


      //prepare chart series data
      var data = _.map($scope.performances.groups, function (group) {
        return {
          name: group.name,
          value: group[column]
        };
      });

      //prepare chart config
      $scope.perServiceGroupConfig = {
        height: 400,
        forceClear: true
      };

      //prepare chart options
      $scope.perServiceGroupOptions = {
        textStyle: {
          fontFamily: 'Lato'
        },
        title: {
          text: column === 'count' ? 'Total' : _.upperFirst(column.toLowerCase()),
          subtext: $filter('number')(_.sumBy(data, 'value'), 0),
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: "{b}:<br/> Count: {c} <br/> Percent: ({d}%)"
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Service Groups Overview - ' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        },
        series: [{
          type: 'pie',
          selectedMode: 'single',
          radius: ['45%', '55%'],
          color: _.map($scope.performances.groups, 'color'),

          label: {
            normal: {
              formatter: '{b}\n{d}%',
            }
          },
          data: data
        }]
      };

    };

    //listen for events and reload performance accordingly
    $rootScope.$on('app:servicerequests:reload', function () {
      $scope.reload();
    });

    //pre-load reports
    //prepare performance details
    $scope.params = Summary.prepareQuery($scope.filters);
    $scope.reload();

  });
