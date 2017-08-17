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
  .controller('DashboardStandingCtrl', function (
    $rootScope, $scope, $state, Summary, standings
  ) {

    //initialize standings
    $scope.standings = standings;

    //initialize scope attributes
    $scope.startedAt;
    $scope.endedAt;
    $scope.maxDate = new Date();
    $scope.params = {
      query: {
        createdAt: {
          $gte: $scope.startedAt,
          $lte: $scope.endedAt
        }
      }
    };

    /**
     * Handle start date changed
     */
    $scope.onStartedAtChange = function (startedAt) {
      //update start date filter and reload
      if (startedAt) {
        $scope.params.query.createdAt.$gte =
          moment(startedAt).utc().startOf('date').toDate();
        $scope.reload();
      }
    };

    /**
     * Handle ended date changed
     */
    $scope.onEndedAtChange = function (endedAt) {

      //update end date filter and reload
      if (endedAt) {
        $scope.params.query.createdAt.$lte =
          moment(endedAt).utc().endOf('date').toDate();
        $scope.reload();
      }

    };


    $scope.prepare = function () {

      //TODO add date filter default to today

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
    $scope.prepareIssuePerJurisdiction = function () {

      //prepare unique jurisdictions for bar chart categories
      var categories = _.chain($scope.standings)
        .map('jurisdiction')
        .uniqBy('name')
        .value();

      //prepare unique jurisdiction color for bar chart and legends color
      var colors = _.map(categories, 'color');

      //prepare unique jurisdiction name for bar chart legends label
      var legends = _.map(categories, 'name');

      //prepare bar chart series data
      var data =
        _.map(categories, function (category) {

          //obtain all standings of specified jurisdiction(category)
          var value =
            _.filter($scope.standings, function (standing) {
              return standing.jurisdiction.name === category.name;
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
      $scope.perJurisdictionConfig = {
        height: 400,
        width: 900
      };

      //prepare chart options
      $scope.perJurisdictionOptions = {
        color: colors,
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
              name: 'Issue per Area-' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          data: _.map(categories, 'name'),
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
            data: [
              { name: 'Maximum', type: 'max' },
              { name: 'Minimum', type: 'min' }
            ]
          },
          markLine: { //add average line
            precision: 0,
            data: [
              { type: 'average', name: 'Average' }
            ]
          },
          data: data
        }]
      };

    };


    /**
     * prepare per jurisdiction per service group bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerJurisdictionPerServiceGroup = function () {

      //prepare unique jurisdictions for bar chart categories
      var categories = _.chain($scope.standings)
        .map('jurisdiction.name')
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
      _.forEach(categories, function (category) {
        _.forEach(groups, function (group) {
          var serie = series[group.name] || {
            name: group.name,
            type: 'bar',
            label: {
              normal: {
                show: true,
              }
            },
            data: []
          };

          //obtain all standings of specified jurisdiction(category)
          //and group
          var value =
            _.filter($scope.standings, function (standing) {
              return (standing.jurisdiction.name === category &&
                standing.group.name === group.name);
            });
          value = value ? _.sumBy(value, 'count') : 0;
          serie.data.push({
            value: value,
            itemStyle: {
              normal: {
                color: group.color
              }
            }
          });
          series[group.name] = serie;
        });
      });
      series = _.values(series);

      //prepare chart config
      $scope.perJurisdictionPerServiceGroupConfig = {
        height: 400,
        width: 900
      };

      //prepare chart options
      $scope.perJurisdictionPerServiceGroupOptions = {
        color: colors,
        textStyle: {
          fontFamily: 'Lato'
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{b} : {c}'
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          y: 'top',
          data: legends
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Issue per Area Per Service Group-' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        },
        calculable: true,
        stack: true,
        xAxis: [{
          type: 'category',
          data: categories
        }],
        yAxis: [{
          type: 'value'
        }],
        series: series
      };

    };


    /**
     * prepare per jurisdiction per service bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerJurisdictionPerService = function () {

      //prepare unique jurisdictions for bar chart categories
      var categories = _.chain($scope.standings)
        .map('jurisdiction.name')
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
        width: 900
      };
      //prepare chart options
      $scope.perJurisdictionPerServiceOptions = [];

      //chunk services for better charting display
      var chunks = _.chunk(services, 4);
      var chunksSize = _.size(chunks);
      _.forEach(chunks, function (_services, index) {

        //prepare unique service color for bar chart and legends color
        var colors = _.map(_services, 'color');

        //prepare unique service name for bar chart legends label
        var legends = _.map(_services, 'name');

        //prepare bar chart series
        var series = {};
        _.forEach(categories, function (category) {
          _.forEach(_services, function (service) {
            var serie = series[service.name] || {
              name: service.name,
              type: 'bar',
              label: {
                normal: {
                  show: true,
                }
              },
              data: []
            };

            //obtain all standings of specified jurisdiction(category)
            //and service
            var value =
              _.filter($scope.standings, function (standing) {
                return (standing.jurisdiction.name ===
                  category &&
                  standing.service.name === service.name);
              });
            value = value ? _.sumBy(value, 'count') : 0;
            serie.data.push({
              value: value,
              itemStyle: {
                normal: {
                  color: service.color
                }
              }
            });
            series[service.name] = serie;
          });
        });
        series = _.values(series);

        //ensure bottom margin for top charts
        var chart = (index === (chunksSize - 1)) ? {} : {
          grid: {
            bottom: '30%'
          }
        };

        //prepare chart options
        $scope.perJurisdictionPerServiceOptions.push(_.merge(chart, {
          color: colors,
          textStyle: {
            fontFamily: 'Lato'
          },
          tooltip: {
            trigger: 'item',
            // formatter: '{b} : {c}'
          },
          legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'top',
            data: legends
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                name: 'Issue per Area Per Service-' + new Date().getTime(),
                title: 'Save',
                show: true
              }
            }
          },
          calculable: true,
          stack: true,
          xAxis: [{
            type: 'category',
            data: categories
          }],
          yAxis: [{
            type: 'value'
          }],
          series: series
        }));

      });

    };



    /**
     * prepare per jurisdiction per status bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerJurisdictionPerStatus = function () {

      //prepare unique jurisdictions for bar chart categories
      var categories = _.chain($scope.standings)
        .map('jurisdiction.name')
        .uniq()
        .value();

      //prepare unique status for bar chart series
      var statuses = _.chain($scope.standings)
        .map('status')
        .uniqBy('name')
        .value();

      //prepare unique status color for bar chart and legends color
      var colors = _.map(statuses, 'color');

      //prepare unique status name for bar chart legends label
      var legends = _.map(statuses, 'name');

      //prepare bar chart series
      var series = {};
      _.forEach(categories, function (category) {
        _.forEach(statuses, function (status) {
          var serie = series[status.name] || {
            name: status.name,
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: []
          };

          //obtain all standings of specified jurisdiction(category)
          //and status
          var value =
            _.filter($scope.standings, function (standing) {
              return (standing.jurisdiction.name ===
                category &&
                standing.status.name === status.name);
            });
          value = value ? _.sumBy(value, 'count') : 0;
          serie.data.push({
            value: value,
            itemStyle: {
              normal: {
                color: status.color
              }
            }
          });
          series[status.name] = serie;
        });
      });
      series = _.values(series);

      //prepare chart config
      $scope.perJurisdictionPerStatusConfig = {
        height: 400,
        width: 900
      };

      //prepare chart options
      $scope.perJurisdictionPerStatusOptions = {
        color: colors,
        textStyle: {
          fontFamily: 'Lato'
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{b} : {c}'
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          y: 'top',
          data: legends
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Issue per Area Per Status-' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          data: categories
        }],
        yAxis: [{
          type: 'value'
        }],
        series: series
      };

    };


    /**
     * prepare per jurisdiction per priority bar chart
     * @return {object} echart bar chart configurations
     * @version 0.1.0
     * @since  0.1.0
     * @author lally elias<lallyelias87@gmail.com>
     */
    $scope.prepareIssuePerJurisdictionPerPriority = function () {

      //prepare unique jurisdictions for bar chart categories
      var categories = _.chain($scope.standings)
        .map('jurisdiction.name')
        .uniq()
        .value();

      //prepare unique priority for bar chart series
      var prioroties = _.chain($scope.standings)
        .map('priority')
        .uniqBy('name')
        .value();

      //prepare unique priority color for bar chart and legends color
      var colors = _.map(prioroties, 'color');

      //prepare unique priority name for bar chart legends label
      var legends = _.map(prioroties, 'name');

      //prepare bar chart series
      var series = {};
      _.forEach(categories, function (category) {
        _.forEach(prioroties, function (priority) {
          var serie = series[priority.name] || {
            name: priority.name,
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: []
          };

          //obtain all standings of specified jurisdiction(category)
          //and priority
          var value =
            _.filter($scope.standings, function (standing) {
              return (standing.jurisdiction.name ===
                category &&
                standing.priority.name === priority.name);
            });
          value = value ? _.sumBy(value, 'count') : 0;
          serie.data.push({
            value: value,
            itemStyle: {
              normal: {
                color: priority.color
              }
            }
          });
          series[priority.name] = serie;
        });
      });
      series = _.values(series);

      //prepare chart config
      $scope.perJurisdictionPerPriorityConfig = {
        height: 400,
        width: 900
      };

      //prepare chart options
      $scope.perJurisdictionPerPriorityOptions = {
        color: colors,
        textStyle: {
          fontFamily: 'Lato'
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{b} : {c}'
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          y: 'top',
          data: legends
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Issue per Area Per Priority-' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          data: categories
        }],
        yAxis: [{
          type: 'value'
        }],
        series: series
      };

    };

    /**
     * Reload standing reports
     */
    $scope.reload = function () {
      var shouldLoad =
        Summary.standings($scope.params).then(function (standings) {
          $scope.standings = standings;
          $scope.prepare();
        });
    };

    //listen for events and reload overview accordingly
    $rootScope.$on('app:servicerequests:reload', function () {
      $scope.reload();
    });


    //on load
    //prepare overview details
    $scope.prepare();


  });
