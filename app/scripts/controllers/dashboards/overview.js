'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:DashboardOverviewCtrl
 * @description
 * # DashboardOverviewCtrl
 * dashboard overview controller of ng311
 */
angular
  .module('ng311')
  .controller('DashboardOverviewCtrl', function(
    $rootScope,
    $scope,
    $filter,
    $state,
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
    $scope.servicetypes = endpoints.servicetypes.data;
    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;
    $scope.workspaces = party.settings.party.relation.workspaces;
    $scope.channels = party.settings.servicerequest.channels;
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
      channels: [],
    };

    //TODO persist filter to local storage
    $scope.filters = defaultFilters;

    //bind exports
    $scope.exports = {
      jurisdictions: {
        filename: 'areas_overview_reports_' + Date.now() + '.csv',
        headers: [
          'Area',
          'Total',
          'Pending',
          'Resolved',
          'Late',
          'Average Attend Time (Call Duration)',
          'Average Resolve Time',
        ],
      },
      groups: {
        filename: 'service_groups_overview_reports_' + Date.now() + '.csv',
        headers: [
          'Service Group',
          'Total',
          'Pending',
          'Resolved',
          'Late',
          'Average Attend Time (Call Duration)',
          'Average Resolve Time',
        ],
      },
      types: {
        filename: 'service_types_overview_reports_' + Date.now() + '.csv',
        headers: [
          'Service Type',
          'Total',
          'Pending',
          'Resolved',
          'Late',
          'Average Attend Time (Call Duration)',
          'Average Resolve Time',
        ],
      },
      services: {
        filename: 'services_overview_reports_' + Date.now() + '.csv',
        headers: [
          'Service',
          'Total',
          'Pending',
          'Resolved',
          'Late',
          'Average Attend Time (Call Duration)',
          'Average Resolve Time',
        ],
      },
      channels: {
        filename: 'reporting_channels_overview_reports_' + Date.now() + '.csv',
        headers: ['Name', 'Total'],
      },
      workspaces: {
        filename: 'workspaces_overview_reports_' + Date.now() + '.csv',
        headers: ['Name', 'Total'],
      },
      operators: {
        filename: 'operators_overview_reports_' + Date.now() + '.csv',
        headers: ['Name', 'Total', 'Pending', 'Resolved'],
      },
    };

    //initialize overviews
    $scope.overviews = {};

    /**
     * Exports current overview data
     */
    $scope.export = function(type) {
      var _exports = _.map($scope.overviews[type], function(overview) {
        overview = {
          name: overview.name,
          total: overview.count,
          pending: overview.pending,
          resolved: overview.resolved,
          late: overview.late,
          averageAttendTime: overview.averageAttendTime
            ? [
                overview.averageAttendTime.days,
                ' days, ',
                overview.averageAttendTime.hours,
                ' hrs, ',
                overview.averageAttendTime.minutes,
                ' mins, ',
                overview.averageAttendTime.seconds,
                ' secs',
              ].join('')
            : undefined,
          averageResolveTime: overview.averageResolveTime
            ? [
                overview.averageResolveTime.days,
                'days, ',
                overview.averageResolveTime.hours,
                'hrs, ',
                overview.averageResolveTime.minutes,
                'mins, ',
                overview.averageResolveTime.seconds,
                'secs, ',
              ].join('')
            : undefined,
        };

        //reshape for workspace and channel
        if (type === 'channels' || type === 'workspaces') {
          overview = _.pick(overview, ['name', 'total']);
        }

        if (type === 'services' || type === 'types') {
          overview = _.merge({}, overview, { name: overview.name.en });
        }

        return overview;
      });

      return _exports;
    };

    /**
     * Open overview reports filter
     */
    $scope.showFilter = function() {
      //open overview reports filter modal
      $scope.modal = $uibModal.open({
        templateUrl: 'views/dashboards/_partials/overviews_filter.html',
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
     * Filter overview reports based on on current selected filters
     * @param {Boolean} [reset] whether to clear and reset filter
     */
    $scope.filter = function(reset) {
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
    $scope.filterServices = function() {
      //check for service group filter activation
      var filterHasServiceGroups =
        $scope.filters.servicegroups && $scope.filters.servicegroups.length > 0;

      //pick only service of selected group
      if (filterHasServiceGroups) {
        //filter services based on service group(s)
        $scope.services = _.filter(endpoints.services.services, function(
          service
        ) {
          var group = _.get(service, 'group._id', _.get(service, 'group'));
          return _.includes($scope.filters.servicegroups, group);
        });
      }
      //use all services
      else {
        $scope.services = endpoints.services.services;
      }
    };

    $scope.prepare = function() {
      //update export filename
      $scope.exports.filename = 'overview_reports_' + Date.now() + '.csv';

      // prepare percentages
      $scope.prepareOverallPercentages();

      //prepare charts
      $scope.prepareServiceVisualization();
      $scope.prepareJurisdictionVisualization();
      $scope.prepareServiceGroupVisualization();
      $scope.prepareServiceTypeVisualization();
      $scope.prepareChannelVisualization();
      $scope.prepareWorkspaceVisualization();
    };

    /**
     * prepare percentages for pending,resolved and late service requests in respect to total
     * service requests
     * @version 0.1.0
     * @since 0.1.0
     * @author Benson Maruchu<benmaruchu@gmail.com>
     */
    $scope.prepareOverallPercentages = function() {
      var overallExists = _.get($scope.overviews, 'overall', false);

      // check if overall data exists
      if (overallExists) {
        var percentages = {
          percentageResolved:
            ($scope.overviews.overall.resolved /
              $scope.overviews.overall.count) *
            100,
          percentagePending:
            ($scope.overviews.overall.pending /
              $scope.overviews.overall.count) *
            100,
          percentageLate:
            ($scope.overviews.overall.late / $scope.overviews.overall.count) *
            100,
        };

        $scope.overviews.overall = _.merge(
          {},
          $scope.overviews.overall,
          percentages
        );
      }
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
      var categories = _.chain($scope.overviews)
        .map('services')
        .uniqBy('name')
        .value();

      //prepare bar chart series data
      var data = _.map($scope.overviews.services, function(service) {
        var serie = {
          name: service.name.en,
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
              name: 'Services Overview - ' + new Date().getTime(),
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

    /**
     * prepare jurisdiction overview visualization
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareJurisdictionVisualization = function(column) {
      //ensure column
      column = column || 'count';

      //prepare chart series data
      var data = _.map($scope.overviews.jurisdictions, function(jurisdiction) {
        return {
          name: jurisdiction.name,
          value: jurisdiction[column],
        };
      });

      //prepare chart config
      $scope.perJurisdictionConfig = {
        height: 400,
        forceClear: true,
      };

      //prepare chart options
      $scope.perJurisdictionOptions = {
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
              name: 'Areas Overview - ' + new Date().getTime(),
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
            color: _.map($scope.overviews.jurisdictions, 'color'),
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
     * prepare service group overview visualization
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareServiceGroupVisualization = function(column) {
      //ensure column
      column = column || 'count';

      //prepare chart series data
      var data = _.map($scope.overviews.groups, function(group) {
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
            color: _.map($scope.overviews.groups, 'color'),

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
     * prepare service type overview visualization
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author Benson Maruchu<benmaruchu@gmail.com>
     */
    $scope.prepareServiceTypeVisualization = function(column) {
      //ensure column
      column = column || 'count';

      //prepare chart series data
      var data = _.map($scope.overviews.types, function(type) {
        return {
          name: type.name.en,
          value: type[column],
        };
      });

      //prepare chart config
      $scope.perServiceTypeConfig = {
        height: 400,
        forceClear: true,
      };

      //prepare chart options
      $scope.perServiceTypeOptions = {
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
              name: 'Service Types Overview - ' + new Date().getTime(),
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
            color: _.map($scope.overviews.types, 'color'),

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
     * prepare channel overview visualization
     * @return {object} echart pie chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareChannelVisualization = function(column) {
      //ensure column
      column = column || 'count';

      //prepare chart series data
      var data = _.map($scope.overviews.channels, function(channel) {
        return {
          name: channel.name,
          value: channel[column],
        };
      });

      //prepare chart config
      $scope.perChannelConfig = {
        height: 400,
        forceClear: true,
      };

      //prepare chart options
      $scope.perChannelOptions = {
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
              name: 'Reporting Channels Overview - ' + new Date().getTime(),
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
            color: _.map($scope.overviews.services, 'color'),
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
      var data = _.map($scope.overviews.workspaces, function(workspace) {
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
            color: _.reverse(_.map($scope.overviews.services, 'color')),
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
     * Reload overview reports
     */
    $scope.reload = function() {
      Summary.overviews({
        filter: $scope.params,
      }).then(function(overviews) {
        $scope.overviews = overviews;
        $scope.prepare();
      });
    };

    //listen for events and reload overview accordingly
    $rootScope.$on('app:servicerequests:reload', function() {
      $scope.reload();
    });

    //pre-load reports
    //prepare overview details
    $scope.params = Summary.prepareQuery($scope.filters);
    $scope.reload();
  });
