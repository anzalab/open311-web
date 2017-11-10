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
  .controller('DashboardOverviewCtrl', function (
    $rootScope, $scope, $filter, $state, $uibModal,
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
      startedAt: moment().utc().startOf('year').toDate(),
      endedAt: moment().utc().endOf('date').toDate(),
      statuses: [],
      priorities: [],
      servicegroups: [],
      jurisdictions: [],
      workspaces: []
    };

    $scope.filters = defaultFilters;

    //bind exports
    $scope.exports = {
      jurisdictions: {
        filename: 'areas_overview_reports_' + Date.now() + '.csv',
        headers: [
          'Area', 'Total', 'Pending', 'Resolved',
          'Late', 'Average Attend Time (Call Duration)',
          'Average Resolve Time'
        ]
      },
      groups: {
        filename: 'service_groups_overview_reports_' + Date.now() + '.csv',
        headers: [
          'Service Group', 'Total', 'Pending', 'Resolved',
          'Late', 'Average Attend Time (Call Duration)',
          'Average Resolve Time'
        ]
      },
      services: {
        filename: 'services_overview_reports_' + Date.now() + '.csv',
        headers: [
          'Service', 'Total', 'Pending', 'Resolved',
          'Late', 'Average Attend Time (Call Duration)',
          'Average Resolve Time'
        ]
      }
    };

    //initialize overviews
    $scope.overviews = {};


    /**
     * Exports current overview data
     */
    $scope.export = function (type) {
      var _exports =
        _.map($scope.overviews[type], function (overview) {
          return {
            name: overview.name,
            total: overview.count,
            pending: overview.pending,
            resolved: overview.resolved,
            late: overview.late,
            averageAttendTime: [
              overview.averageAttendTime.days, ' days, ',
              overview.averageAttendTime.hours, ' hrs, ',
              overview.averageAttendTime.minutes, ' mins, ',
              overview.averageAttendTime.seconds, ' secs'
            ].join(''),
            averageResolveTime: [
              overview.averageResolveTime.days, 'days, ',
              overview.averageResolveTime.hours, 'hrs, ',
              overview.averageResolveTime.minutes, 'mins, ',
              overview.averageResolveTime.seconds, 'secs, '
            ].join(''),
          };
        });
      return _exports;
    };


    /**
     * Open overview reports filter
     */
    $scope.showFilter = function () {

      //open overview reports filter modal
      $scope.modal = $uibModal.open({
        templateUrl: 'views/dashboards/_partials/overviews_filter.html',
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


    $scope.prepare = function () {

      //notify no data loaded
      // if (!$scope.overviews || $scope.overviews.length <= 0) {
      //   $rootScope.$broadcast('appWarning', {
      //     message: 'No Data Found. Please Update Your Filters.'
      //   });
      // }

      //update export filename
      $scope.exports.filename = 'overview_reports_' + Date.now() + '.csv';

      //prepare charts
      // $scope.prepareIssuePerServiceGroup();
      // $scope.prepareIssuePerService();
      // $scope.prepareIssuePerStatus();
      $scope.prepareServiceGroupVisualization();

    };

    /**
     * prepare per service group bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerServiceGroup = function () {

      //prepare unique service groups for bar chart categories
      var categories = _.chain($scope.overviews)
        .map('group')
        .uniqBy('name')
        .value();

      //prepare bar chart series data
      var data =
        _.map(categories, function (category) {

          //obtain all overviews of specified group(category)
          var value =
            _.filter($scope.overviews, function (overview) {
              return overview.group.name === category.name;
            });
          value = value ? _.sumBy(value, 'count') : 0;
          var serie = {
            name: category.name,
            value: value,
            itemStyle: {
              normal: {
                color: category.color
              }
            }
          };

          return serie;

        });

      //sort data by their value
      data = _.orderBy(data, 'value', 'desc');

      //prepare chart config
      $scope.perGroupConfig = {
        height: 400,
        forceClear: true
      };

      //prepare chart options
      $scope.perGroupOptions = {
        color: _.map(data, 'itemStyle.normal.color'),
        textStyle: {
          fontFamily: 'Lato'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Issue per Service Group-' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        },
        calculable: true,
        yAxis: [{
          type: 'category',
          data: _.map(data, 'name'),
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            rotate: 60,
            padding: [0, 0, 14, 0]
          },
          axisLine: {
            show: true
          }
        }],
        xAxis: [{
          type: 'value',
          scale: true,
          position: 'top',
          axisTick: {
            show: false,
            lineStyle: {
              color: '#ddd'
            }
          },
          splitLine: {
            show: false
          }
        }],
        series: [{
          type: 'bar',
          barWidth: '45%',
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          },
          data: data
        }]
      };

    };

    /**
     * prepare per status bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerStatus = function () {

      //prepare unique status for bar chart categories
      var categories = _.chain($scope.overviews)
        .map('status')
        .sortBy('weight')
        .uniqBy('name')
        .value();

      //prepare bar chart series data
      var data =
        _.map(categories, function (category) {

          //obtain all overviews of specified status(category)
          var value =
            _.filter($scope.overviews, function (overview) {
              return overview.status.name === category.name;
            });
          value = value ? _.sumBy(value, 'count') : 0;
          var serie = {
            name: category.name,
            value: value,
            itemStyle: {
              normal: {
                color: category.color
              }
            }
          };

          return serie;

        });

      //prepare chart config
      $scope.perStatusConfig = {
        height: 400,
        forceClear: true
      };

      //prepare chart options
      $scope.perStatusOptions = {
        color: _.map(data, 'itemStyle.normal.color'),
        textStyle: {
          fontFamily: 'Lato'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Issue per Status-' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          data: _.map(data, 'name'),
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          type: 'bar',
          barWidth: '70%',
          label: {
            normal: {
              show: true
            }
          },
          markPoint: { // show area with maximum and minimum
            data: [{
                name: 'Maximum',
                type: 'max'
              },
              {
                name: 'Minimum',
                type: 'min'
              }
            ]
          },
          markLine: { //add average line
            precision: 0,
            data: [{
              type: 'average',
              name: 'Average'
            }]
          },
          data: data
        }]
      };

    };


    /**
     * prepare per priority bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareServiceGroupVisualization = function (column) {

      //ensure column
      column = column || 'count';


      //prepare bar chart series data
      var data = _.map($scope.overviews.groups, function (group) {
        return {
          name: group.name,
          value: group[column]
        }
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
          color: _.map($scope.overviews.groups, 'color'),

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
     * prepare per service bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerService = function () {

      //prepare unique services for bar chart categories
      var categories = _.chain($scope.overviews)
        .map('service')
        .uniqBy('name')
        .value();

      //prepare chart config
      $scope.perPerServiceConfig = {
        height: 400,
        forceClear: true
      };

      //prepare chart options
      $scope.perPerServiceOptions = [];

      //chunk services for better charting display
      var chunks = _.chunk(categories, 6);
      var chunksSize = _.size(chunks);
      _.forEach(chunks, function (services, index) {

        //prepare bar chart serie data
        var data =
          _.map(services, function (category) {

            //obtain all overviews of specified priority(category)
            var value =
              _.filter($scope.overviews, function (overview) {
                return overview.service.name === category.name;
              });
            value = value ? _.sumBy(value, 'count') : 0;
            var serie = {
              name: category.name,
              value: value,
              itemStyle: {
                normal: {
                  color: category.color
                }
              }
            };

            return serie;

          });

        //ensure bottom margin for top charts
        var chart = (index === (chunksSize - 1)) ? {} : {
          grid: {
            bottom: '30%'
          }
        };

        //prepare chart options
        $scope.perPerServiceOptions.push(_.merge(chart, {
          color: _.map(data, 'itemStyle.normal.color'),
          textStyle: {
            fontFamily: 'Lato'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c}'
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                name: 'Issue Per Service-' + new Date().getTime(),
                title: 'Save',
                show: true
              }
            }
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            data: _.map(data, 'name'),
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            type: 'bar',
            barWidth: '70%',
            label: {
              normal: {
                show: true
              }
            },
            markPoint: { // show area with maximum and minimum
              data: [{
                  name: 'Maximum',
                  type: 'max'
                },
                {
                  name: 'Minimum',
                  type: 'min'
                }
              ]
            },
            markLine: { //add average line
              precision: 0,
              data: [{
                type: 'average',
                name: 'Average'
              }]
            },
            data: data
          }]
        }));

      });

    };


    /**
     * Reload overview reports
     */
    $scope.reload = function () {
      Summary
        .overviews({
          query: $scope.params
        })
        .then(function (overviews) {
          $scope.overviews = overviews;
          $scope.prepare();
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
