'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:DashboardStandingCtrl
 * @description
 * # DashboardStandingCtrl
 * dashboard daily standing controller of ng311
 */
angular
  .module('ng311')
  .controller('DashboardStandingCtrl', function(
    $rootScope,
    $scope,
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

    //bind exports
    $scope.maxDate = new Date();
    $scope.exports = {
      filename: 'standing_reports_' + Date.now() + '.csv',
      headers: [
        'Area',
        'Service Group',
        'Service',
        'Status',
        'Priority',
        'Count',
      ],
    };

    //initialize standings
    $scope.standings = [];

    /**
     * Exports current standing data
     */
    $scope.export = function() {
      var _exports = _.map($scope.standings, function(standing) {
        return {
          jurisdiction: standing.jurisdiction.name,
          servicegroup: standing.group.name,
          service: standing.service.name,
          status: standing.status.name,
          priority: standing.priority.name,
          count: standing.count,
        };
      });
      return _exports;
    };

    /**
     * Open overview reports filter
     */
    $scope.showFilter = function() {
      //open overview reports filter modal
      $scope.modal = $uibModal.open({
        templateUrl: 'views/dashboards/_partials/standings_filter.html',
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

    /**
     * Prepare standing reports for display
     */
    $scope.prepare = function() {
      //notify no data loaded
      // if (!$scope.standings || $scope.standings.length <= 0) {
      //   $rootScope.$broadcast('appWarning', {
      //     message: 'No Data Found. Please Update Your Filters.'
      //   });
      // }

      //update export filename
      $scope.exports.filename = 'standing_reports_' + Date.now() + '.csv';

      //build reports
      $scope.prepareIssuePerJurisdiction();
      $scope.prepareIssuePerJurisdictionPerServiceGroup();
      $scope.prepareIssuePerJurisdictionPerService();
      $scope.prepareIssuePerJurisdictionPerPriority();
      $scope.prepareIssuePerJurisdictionPerStatus();
    };

    /**
     * prepare per jurisdiction
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerJurisdiction = function() {
      //prepare unique jurisdictions for bar chart categories
      var categories = _.chain($scope.standings)
        .map('jurisdiction')
        .sortBy('name')
        .uniqBy('name')
        .value();

      //prepare unique jurisdiction color for bar chart and legends color
      var colors = _.map(categories, 'color');

      //prepare unique jurisdiction name for bar chart legends label
      var legends = _.map(categories, 'name');

      //prepare bar chart series data
      var data = _.map(categories, function(category) {
        //obtain all standings of specified jurisdiction(category)
        var value = _.filter($scope.standings, function(standing) {
          return standing.jurisdiction.name === category.name;
        });
        value = value ? _.sumBy(value, 'count') : 0;
        var serie = {
          name: category.name,
          value: value,
          itemStyle: {
            normal: {
              color: category.color,
            },
          },
        };

        return serie;
      });

      //prepare chart config
      $scope.perJurisdictionConfig = {
        height: 400,
        forceClear: true,
      };

      //prepare chart options
      $scope.perJurisdictionOptions = {
        color: colors,
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
              name: 'Issue per Area-' + new Date().getTime(),
              title: 'Save',
              show: true,
            },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: _.map(categories, 'name'),
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: '70%',
            label: {
              normal: {
                show: true,
              },
            },
            markPoint: {
              // show area with maximum and minimum
              data: [
                { name: 'Maximum', type: 'max' },
                { name: 'Minimum', type: 'min' },
              ],
            },
            markLine: {
              //add average line
              precision: 0,
              data: [{ type: 'average', name: 'Average' }],
            },
            data: data,
          },
        ],
      };
    };

    /**
     * prepare per jurisdiction per service group bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerJurisdictionPerServiceGroup = function() {
      //prepare unique jurisdictions for bar chart categories
      var categories = _.chain($scope.standings)
        .map('jurisdiction')
        .sortBy('name')
        .map('name')
        .uniq()
        .value();

      //prepare unique group for bar chart series
      var groups = _.chain($scope.standings)
        .map('group')
        .uniqBy('name')
        .value();

      //prepare unique group color for bar chart and legends color
      var colors = _.map(groups, 'color');

      //prepare unique group name for bar chart legends label
      var legends = _.map(groups, 'name');

      //prepare bar chart series
      var series = {};
      _.forEach(categories, function(category) {
        _.forEach(groups, function(group) {
          var serie = series[group.name] || {
            name: group.name,
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top',
              },
            },
            data: [],
          };

          //obtain all standings of specified jurisdiction(category)
          //and group
          var value = _.filter($scope.standings, function(standing) {
            return (
              standing.jurisdiction.name === category &&
              standing.group.name === group.name
            );
          });
          value = value ? _.sumBy(value, 'count') : 0;
          serie.data.push({
            value: value,
            itemStyle: {
              normal: {
                color: group.color,
              },
            },
          });
          series[group.name] = serie;
        });
      });
      series = _.values(series);

      //prepare chart config
      $scope.perJurisdictionPerServiceGroupConfig = {
        height: 400,
        forceClear: true,
      };

      //prepare chart options
      $scope.perJurisdictionPerServiceGroupOptions = {
        color: colors,
        textStyle: {
          fontFamily: 'Lato',
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{b} : {c}'
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          y: 'top',
          data: legends,
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Issue per Area Per Service Group-' + new Date().getTime(),
              title: 'Save',
              show: true,
            },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: categories,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: series,
      };
    };

    /**
     * prepare per jurisdiction per service bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerJurisdictionPerService = function() {
      //prepare unique jurisdictions for bar chart categories
      var categories = _.chain($scope.standings)
        .map('jurisdiction')
        .sortBy('name')
        .map('name')
        .uniq()
        .value();

      //prepare unique service for bar chart series
      var services = _.chain($scope.standings)
        .map('service')
        .uniqBy('name')
        .value();

      //prepare chart config
      $scope.perJurisdictionPerServiceConfig = {
        height: 400,
        forceClear: true,
      };
      //prepare chart options
      $scope.perJurisdictionPerServiceOptions = [];

      //chunk services for better charting display
      var chunks = _.chunk(services, 4);
      var chunksSize = _.size(chunks);
      _.forEach(chunks, function(_services, index) {
        //prepare unique service color for bar chart and legends color
        var colors = _.map(_services, 'color');

        //prepare unique service name for bar chart legends label
        var legends = _.map(_services, 'name');

        //prepare bar chart series
        var series = {};
        _.forEach(categories, function(category) {
          _.forEach(_services, function(service) {
            var serie = series[service.name] || {
              name: service.name,
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'top',
                },
              },
              data: [],
            };

            //obtain all standings of specified jurisdiction(category)
            //and service
            var value = _.filter($scope.standings, function(standing) {
              return (
                standing.jurisdiction.name === category &&
                standing.service.name === service.name
              );
            });
            value = value ? _.sumBy(value, 'count') : 0;
            serie.data.push({
              value: value,
              itemStyle: {
                normal: {
                  color: service.color,
                },
              },
            });
            series[service.name] = serie;
          });
        });
        series = _.values(series);

        //ensure bottom margin for top charts
        var chart =
          index === chunksSize - 1
            ? {}
            : {
                grid: {
                  bottom: '30%',
                },
              };

        //prepare chart options
        $scope.perJurisdictionPerServiceOptions.push(
          _.merge(chart, {
            color: colors,
            textStyle: {
              fontFamily: 'Lato',
            },
            tooltip: {
              trigger: 'item',
              // formatter: '{b} : {c}'
            },
            legend: {
              orient: 'horizontal',
              x: 'center',
              y: 'top',
              data: legends,
            },
            toolbox: {
              show: true,
              feature: {
                saveAsImage: {
                  name: 'Issue per Area Per Service-' + new Date().getTime(),
                  title: 'Save',
                  show: true,
                },
              },
            },
            calculable: true,
            xAxis: [
              {
                type: 'category',
                data: categories,
              },
            ],
            yAxis: [
              {
                type: 'value',
              },
            ],
            series: series,
          })
        );
      });
    };

    /**
     * prepare per jurisdiction per status bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerJurisdictionPerStatus = function() {
      //prepare unique jurisdictions for bar chart categories
      var categories = _.chain($scope.standings)
        .map('jurisdiction')
        .sortBy('name')
        .map('name')
        .uniq()
        .value();

      //prepare unique status for bar chart series
      var statuses = _.chain($scope.standings)
        .map('status')
        .sortBy('weight')
        .uniqBy('name')
        .value();

      //prepare unique status color for bar chart and legends color
      var colors = _.map(statuses, 'color');

      //prepare unique status name for bar chart legends label
      var legends = _.map(statuses, 'name');

      //prepare bar chart series
      var series = {};
      _.forEach(categories, function(category) {
        _.forEach(statuses, function(status) {
          var serie = series[status.name] || {
            name: status.name,
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top',
              },
            },
            data: [],
          };

          //obtain all standings of specified jurisdiction(category)
          //and status
          var value = _.filter($scope.standings, function(standing) {
            return (
              standing.jurisdiction.name === category &&
              standing.status.name === status.name
            );
          });
          value = value ? _.sumBy(value, 'count') : 0;
          serie.data.push({
            value: value,
            itemStyle: {
              normal: {
                color: status.color,
              },
            },
          });
          series[status.name] = serie;
        });
      });
      series = _.values(series);

      //prepare chart config
      $scope.perJurisdictionPerStatusConfig = {
        height: 400,
        forceClear: true,
      };

      //prepare chart options
      $scope.perJurisdictionPerStatusOptions = {
        color: colors,
        textStyle: {
          fontFamily: 'Lato',
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{b} : {c}'
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          y: 'top',
          data: legends,
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Issue per Area Per Status-' + new Date().getTime(),
              title: 'Save',
              show: true,
            },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: categories,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: series,
      };
    };

    /**
     * prepare per jurisdiction per priority bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerJurisdictionPerPriority = function() {
      //prepare unique jurisdictions for bar chart categories
      var categories = _.chain($scope.standings)
        .map('jurisdiction')
        .sortBy('name')
        .map('name')
        .uniq()
        .value();

      //prepare unique priority for bar chart series
      var prioroties = _.chain($scope.standings)
        .map('priority')
        .sortBy('weight')
        .uniqBy('name')
        .value();

      //prepare unique priority color for bar chart and legends color
      var colors = _.map(prioroties, 'color');

      //prepare unique priority name for bar chart legends label
      var legends = _.map(prioroties, 'name');

      //prepare bar chart series
      var series = {};
      _.forEach(categories, function(category) {
        _.forEach(prioroties, function(priority) {
          var serie = series[priority.name] || {
            name: priority.name,
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top',
              },
            },
            data: [],
          };

          //obtain all standings of specified jurisdiction(category)
          //and priority
          var value = _.filter($scope.standings, function(standing) {
            return (
              standing.jurisdiction.name === category &&
              standing.priority.name === priority.name
            );
          });
          value = value ? _.sumBy(value, 'count') : 0;
          serie.data.push({
            value: value,
            itemStyle: {
              normal: {
                color: priority.color,
              },
            },
          });
          series[priority.name] = serie;
        });
      });
      series = _.values(series);

      //prepare chart config
      $scope.perJurisdictionPerPriorityConfig = {
        height: 400,
        forceClear: true,
      };

      //prepare chart options
      $scope.perJurisdictionPerPriorityOptions = {
        color: colors,
        textStyle: {
          fontFamily: 'Lato',
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{b} : {c}'
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          y: 'top',
          data: legends,
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Issue per Area Per Priority-' + new Date().getTime(),
              title: 'Save',
              show: true,
            },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: categories,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: series,
      };
    };

    /**
     * Reload standing reports
     */
    $scope.reload = function() {
      Summary.standings({ filter: $scope.params }).then(function(standings) {
        standings = _.map(standings, function(standing) {
          standing.group.name = standing.group.name.en;
          standing.service.name = standing.service.name.en;
          standing.priority.name = standing.priority.name.en;
          standing.status.name = standing.status.name.en;
          return standing;
        });

        $scope.standings = standings;
        $scope.prepare();
      });
    };

    //pre-load reports
    //prepare overview details
    $scope.params = Summary.prepareQuery($scope.filters);
    $scope.reload();
  });
