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
      items: {
        headers: ['Material', 'Quantity'],
      },
      workspaces: {
        headers: ['Name', 'Total', 'Pending', 'Resolved'],
      },
    };

    /**
     * Exports current operation data
     */
    $scope.export = function(type) {
      var _exports = _.map($scope.operations[type], function(operation) {
        if (type === 'items') {
          operation = _.pick(operation, ['name', 'count']);

          return _.merge({}, operation, { name: operation.name.en });
        }

        //reshape for workspace
        if (type === 'workspaces') {
          return (operation = _.pick(operation, [
            'name',
            'count',
            'pending',
            'resolved',
          ]));
        }

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

    /**
     * prepare workspace overview visualization
     * @return {object} echart pie chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareWorkspaceVisualization = function(column) {
      //ensure column
      column = column || 'count';

      //prepare chart series data
      var data = _.map($scope.operations.workspaces, function(workspace) {
        return {
          name: workspace.name,
          value: workspace[column],
        };
      });

      //prepare chart config
      $scope.perWorkspaceConfig = {
        height: 400,
        forceClear: true,
      };

      //prepare chart options
      $scope.perWorkspaceOptions = {
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
              name: 'Workspaces Overview - ' + new Date().getTime(),
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
            color: _.reverse(_.map($scope.operations.services, 'color')),
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

    $scope.prepare = function() {
      //shaping data
      $scope.prepareSummaries();

      $scope.prepareWorkspaceVisualization();

      // prepare percentages for overall summary
      $scope.prepareOverallPercentages();
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
          $scope.prepare();
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

      var operationTotal =
        $scope.operations.overall.new +
        $scope.operations.overall.assigned +
        $scope.operations.overall.attended +
        $scope.operations.overall.completed +
        $scope.operations.overall.verified +
        $scope.operations.overall.approved;

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
          percentageWaiting:
            ($scope.operations.overall.new / operationTotal) * 100,
          percentageAssigned:
            ($scope.operations.overall.assigned / operationTotal) * 100,
          percentageAttending:
            ($scope.operations.overall.attended / operationTotal) * 100,
          percentageCompleted:
            ($scope.operations.overall.completed / operationTotal) * 100,
          percentageVerified:
            ($scope.operations.overall.verified / operationTotal) * 100,
          percentageApproved:
            ($scope.operations.overall.approved / operationTotal) * 100,
        };

        $scope.operations.overall = _.merge(
          {},
          $scope.operations.overall,
          percentages
        );
      }
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
