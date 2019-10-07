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
  .controller('DashboardOperationCtrl', function(
    $rootScope,
    $scope,
    $filter,
    $stateParams,
    $uibModal,
    Summary,
    endpoints,
    party
  ) {
    //initialize scope attributes
    $scope.maxDate = new Date();

    //bind states
    $scope.priorities = endpoints.priorities.priorities;
    $scope.statuses = endpoints.statuses.statuses;
    $scope.services = endpoints.services.services;
    $scope.servicegroups = endpoints.servicegroups.servicegroups;
    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
    $scope.servicetypes = endpoints.servicetypes.data;
    $scope.workspaces = party.settings.party.relation.workspaces;
    $scope.methods = party.settings.servicerequest.methods;
    $scope.materials = [
      { name: 'Adaptor Flange 10’’ PVC', quantity: 1 },
      { name: 'Adaptor Flange 10’’ GS', quantity: 1 },
      { name: 'Adaptor Flange 12’’ GS', quantity: 1 },
      { name: 'Adaptor Flange 12’’ PVC', quantity: 1 },
      { name: 'Adaptor Flange 3’’ GS', quantity: 1 },
      { name: 'Adaptor Flange 3’’ PVC', quantity: 1 },
      { name: 'Adaptor Flange 4’’ GS', quantity: 1 },
      { name: 'Adaptor Flange 4’’ PVC', quantity: 1 },
      { name: 'Adaptor Flange 6’’ GS', quantity: 1 },
      { name: 'Adaptor Flange 6’’ PVC', quantity: 1 },
      { name: 'Adaptor Flange 8’’ GS', quantity: 1 },
      { name: 'Adaptor Flange 8’’ PVC', quantity: 1 },
      { name: 'Air Valve 1" Double Acting (GS)', quantity: 1 },
      { name: 'Air Valve 1" Single Acting (GS)', quantity: 1 },
      { name: 'Air Valve 2"Double Acting (GS)', quantity: 1 },
      { name: 'Air Valve 2"Single Acting (GS)', quantity: 1 },
      { name: 'Air Valve 3"Double Acting (GS)', quantity: 1 },
      { name: 'Air Valve 3"Single Acting (GS)', quantity: 1 },
    ];
    $scope.reasons = [
      { name: 'No Transport', count: 3 },
      { name: 'No Materials', count: 10 },
      { name: 'Other Works', count: 13 },
    ];
    $scope.zones = [
      {
        name: 'Zone A',
        total: 10,
        inProgress: 4,
        done: 2,
        verified: 2,
        closed: 2,
        late: 0,
      },
      {
        name: 'Zone B',
        total: 10,
        inProgress: 4,
        done: 2,
        verified: 2,
        closed: 2,
        late: 0,
      },
      {
        name: 'Zone C',
        total: 10,
        inProgress: 4,
        done: 2,
        verified: 2,
        closed: 2,
        late: 0,
      },
      {
        name: 'Zone D',
        total: 10,
        inProgress: 4,
        done: 2,
        verified: 2,
        closed: 2,
        late: 0,
      },
    ];

    //set default jurisdiction
    $scope.jurisdiction =
      $stateParams.jurisdiction || _.first($scope.jurisdictions);

    //bind filters
    var defaultFilters = {
      startedAt:
        $stateParams.startedAt ||
        moment()
          .utc()
          .startOf('date')
          .toDate(),
      endedAt:
        $stateParams.endedAt ||
        moment()
          .utc()
          .endOf('date')
          .toDate(),
      jurisdictions: $scope.jurisdiction._id,
    };

    //TODO persist filter to local storage
    $scope.filters = defaultFilters;

    //initialize performances
    $scope.operations = {};

    $scope.exports = {
      services: {
        headers: [
          'Service',
          'Assigned',
          'Attending',
          'Completed',
          'Verified',
          'Approved',
          'Average Attend Time',
          'Average Work Time',
          'Average Resolution Time',
        ],
      },
    };

    /**
     * Exports current operation data
     */
    $scope.export = function(type) {
      var _exports = _.map($scope.operations[type], function(operation) {
        operation = {
          name: operation.name,
          assigned: operation.assigned,
          attending: operation.attended,
          completed: operation.completed,
          verified: operation.verified,
          approved: operation.approved,
          averageAssignTime: operation.assignTime.average
            ? [
                operation.assignTime.average.days,
                ' days, ',
                operation.assignTime.average.hours,
                ' hrs, ',
                operation.assignTime.average.minutes,
                ' mins, ',
                operation.assignTime.average.seconds,
                ' secs',
              ].join('')
            : undefined,

          averageWorkTime: operation.workTime
            ? [
                operation.workTime.average.days,
                'days, ',
                operation.workTime.average.hours,
                'hrs, ',
                operation.workTime.average.minutes,
                'mins, ',
                operation.workTime.average.seconds,
                'secs, ',
              ].join('')
            : undefined,
          averageResolveTime: operation.resolveTime
            ? [
                operation.resolveTime.average.days,
                'days, ',
                operation.resolveTime.average.hours,
                'hrs, ',
                operation.resolveTime.average.minutes,
                'mins, ',
                operation.resolveTime.average.seconds,
                'secs, ',
              ].join('')
            : undefined,
        };

        //reshape for workspace and channel
        if (type === 'channels' || type === 'workspaces') {
          operation = _.pick(operation, ['name', 'total']);
        }

        if (type === 'services' || type === 'types') {
          operation = _.merge({}, operation, { name: operation.name.en });
        }

        return operation;
      });

      return _exports;
    };

    /**
     * Open performance reports filter
     */
    $scope.showFilter = function() {
      //open performance reports filter modal
      $scope.modal = $uibModal.open({
        templateUrl: 'views/dashboards/_partials/operations_filter.html',
        scope: $scope,
        size: 'lg',
      });

      //handle modal close and dismissed
      $scope.modal.result.then(
        function onClose(/*selectedItem*/) {},
        function onDismissed() {}
      );
    };

    /**
     * Filter performance reports based on on current selected filters
     * @param {Boolean} [reset] whether to clear and reset filter
     */
    $scope.filter = function(reset) {
      if (reset) {
        $scope.filters = defaultFilters;
      }

      //prepare query
      $scope.params = Summary.prepareQuery($scope.filters);

      //reset area
      var _id = $scope.filters.jurisdictions;
      $scope.jurisdiction = _.find($scope.jurisdictions, {
        _id: _id,
      });

      //load reports
      $scope.reload();

      //close current modal
      $scope.modal.close();
    };

    //prepare summaries
    //TODO make api to return data
    $scope.prepareSummaries = function() {
      //prepare summary
      $scope.operations.summaries = [
        {
          name: 'Resolved',
          count: _.get($scope.operations, 'overall.resolved', 0),
          color: '#8BC34A',
        },
        {
          name: 'Pending',
          count: _.get($scope.operations, 'overall.pending', 0),
          color: '#00BCD4',
        },
        {
          name: 'Late',
          count: _.get($scope.operations, 'overall.late', 0),
          color: '#009688',
        },
      ];
    };

    $scope.prepare = function() {
      //shaping data
      $scope.prepareSummaries();

      // prepare percentages for overall summary
      $scope.prepareOverallPercentages();

      //prepare visualization
      $scope.prepareSummaryVisualization();
      $scope.prepareStatusesVisualization();
      $scope.prepareServiceGroupVisualization();
      $scope.prepareServiceVisualization();
    };

    /**
     * Reload performance reports
     */
    $scope.reload = function() {
      Summary.operations({
        filter: $scope.params,
      }).then(function(operations) {
        $scope.operations = operations;

        //ensure performances loaded
        if ($scope.operations) {
          //ensure status are sorted by weight
          // $scope.prepare();
        }
      });
    };

    /**
     * prepare percentages for pending,resolved and late service requests in respect to total
     * service requests
     * @version 0.1.0
     * @since 0.1.0
     * @author Benson Maruchu<benmaruchu@gmail.com>
     */
    $scope.prepareOverallPercentages = function() {
      var overallExists = _.get($scope.operations, 'overall', false);

      // check if overall data exists
      if (overallExists) {
        var percentages = {
          percentageResolved:
            ($scope.operations.overall.resolved /
              $scope.operations.overall.count) *
            100,
          percentagePending:
            ($scope.operations.overall.pending /
              $scope.operations.overall.count) *
            100,
          percentageLate:
            ($scope.operations.overall.late / $scope.operations.overall.count) *
            100,
        };

        $scope.operations.overall = _.merge(
          {},
          $scope.operations.overall,
          percentages
        );
      }
    };

    /**
     * prepare summary visualization
     * @return {object} echart donut chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareSummaryVisualization = function() {
      //prepare chart series data
      var data = _.map($scope.operations.summaries, function(summary) {
        return {
          name: summary.name,
          value: summary.count,
        };
      });

      //prepare chart config
      $scope.perSummaryConfig = {
        height: 400,
        forceClear: true,
      };

      //prepare chart options
      $scope.perSummaryOptions = {
        textStyle: {
          fontFamily: 'Lato',
        },
        title: {
          text: 'Total',
          subtext: $filter('number')(_.sumBy(data, 'value'), 0),
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
          },
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}:<br/> Count: {c} <br/> Percent: ({d}%)',
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Area Overview - ' + new Date().getTime(),
              title: 'Save',
              show: true,
            },
          },
        },
        series: [
          {
            type: 'pie',
            selectedMode: 'single',
            radius: ['45%', '55%'],
            color: _.map($scope.operations.summaries, 'color'),
            label: {
              normal: {
                formatter: '{b}\n{d}%\n( {c} )',
              },
            },
            data: data,
          },
        ],
      };
    };

    /**
     * prepare statuses visualization
     * @return {object} echart donut chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareStatusesVisualization = function() {
      //prepare chart series data
      var data = _.map($scope.operations.statuses, function(status) {
        return {
          name: status.name,
          value: status.count,
        };
      });

      //prepare chart config
      $scope.perStatusesConfig = {
        height: 400,
        forceClear: true,
      };

      //prepare chart options
      $scope.perStatusesOptions = {
        textStyle: {
          fontFamily: 'Lato',
        },
        title: {
          text: 'Total',
          subtext: $filter('number')(_.sumBy(data, 'value'), 0),
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
          },
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}:<br/> Count: {c} <br/> Percent: ({d}%)',
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Area Status Overview - ' + new Date().getTime(),
              title: 'Save',
              show: true,
            },
          },
        },
        series: [
          {
            type: 'pie',
            selectedMode: 'single',
            radius: ['45%', '55%'],
            color: _.map($scope.operations.statuses, 'color'),
            label: {
              normal: {
                formatter: '{b}\n{d}%\n( {c} )',
              },
            },
            data: data,
          },
        ],
      };
    };

    /**
     * prepare service group performance visualization
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareServiceGroupVisualization = function(column) {
      //ensure column
      column = column || 'count';

      //prepare chart series data
      var data = _.map($scope.operations.groups, function(group) {
        return {
          name: group.name,
          value: group[column],
        };
      });

      //prepare chart config
      $scope.perServiceGroupConfig = {
        height: 400,
        forceClear: true,
      };

      //prepare chart options
      $scope.perServiceGroupOptions = {
        textStyle: {
          fontFamily: 'Lato',
        },
        title: {
          text:
            column === 'count' ? 'Total' : _.upperFirst(column.toLowerCase()),
          subtext: $filter('number')(_.sumBy(data, 'value'), 0),
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
          },
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}:<br/> Count: {c} <br/> Percent: ({d}%)',
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Service Groups Overview - ' + new Date().getTime(),
              title: 'Save',
              show: true,
            },
          },
        },
        series: [
          {
            type: 'pie',
            selectedMode: 'single',
            radius: ['45%', '55%'],
            color: _.map($scope.operations.groups, 'color'),

            label: {
              normal: {
                formatter: '{b}\n{d}%\n( {c} )',
              },
            },
            data: data,
          },
        ],
      };
    };

    /**
     * prepare per service bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareServiceVisualization = function(column) {
      //ensure column
      column = column || 'count';

      //prepare unique services for bar chart categories
      // var categories = _.chain($scope.operations)
      //   .map('services')
      //   .uniqBy('name')
      //   .value();

      //prepare bar chart series data
      var data = _.map($scope.operations.services, function(service) {
        var serie = {
          name: service.name,
          value: service[column],
          itemStyle: {
            normal: {
              color: service.color,
            },
          },
        };

        return serie;
      });

      //sort data by their value
      data = _.orderBy(data, 'value', 'asc');

      //prepare chart config
      $scope.perServiceConfig = {
        height: '1100',
        forceClear: true,
      };

      //prepare chart options
      $scope.perServiceOptions = {
        color: _.map(data, 'itemStyle.normal.color'),
        textStyle: {
          fontFamily: 'Lato',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}',
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Area Services Overview - ' + new Date().getTime(),
              title: 'Save',
              show: true,
            },
          },
        },
        calculable: true,
        yAxis: [
          {
            type: 'category',
            data: _.map(data, 'name'),
            boundaryGap: true,
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              rotate: 60,
            },
            axisLine: {
              show: true,
            },
          },
        ],
        xAxis: [
          {
            type: 'value',
            scale: true,
            position: 'top',
            boundaryGap: true,
            axisTick: {
              show: false,
              lineStyle: {
                color: '#ddd',
              },
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: '55%',
            label: {
              normal: {
                show: true,
                position: 'right',
              },
            },
            data: data,
          },
        ],
      };
    };

    //listen for events and reload performance accordingly
    $rootScope.$on('app:servicerequests:reload', function() {
      $scope.reload();
    });

    //pre-load reports
    //prepare performance details
    $scope.params = Summary.prepareQuery($scope.filters);
    $scope.reload();
  });
