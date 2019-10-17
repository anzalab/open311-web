'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:DashboardTrendingCtrl
 * @description
 * # DashboardTrendingCtrl
 * dashboard daily trending controller of ng311
 */

angular
  .module('ng311')
  .controller('DashboardTrendingCtrl', function($scope, Summary) {
    $scope.reload = function() {
      Summary.trendings().then(function(trending) {
        $scope.trending = trending;
        $scope.prepare();
      });
    };

    $scope.prepareCountPerHourPerDayVisualization = function() {
      var data = _.flatten(
        _.map($scope.trending.countPerHourPerDay, function(value) {
          return _.map(value.hours, function(hourValue) {
            var day = value.day - 1;
            return [hourValue.hour, day, hourValue.count];
          });
        })
      );

      var hours = [
        '12am',
        '1am',
        '2am',
        '3am',
        '4am',
        '5am',
        '6am',
        '7am',
        '8am',
        '9am',
        '10am',
        '11am',
        '12pm',
        '1pm',
        '2pm',
        '3pm',
        '4pm',
        '5pm',
        '6pm',
        '7pm',
        '8pm',
        '9pm',
        '10pm',
        '11pm',
      ];

      var days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      $scope.perHourPerDayConfig = {
        height: 500,
        forceClear: true,
      };

      $scope.perHourPerDayOptions = {
        tooltip: {
          position: 'top',
        },
        animation: false,
        grid: {
          height: '50%',
          y: '10%',
        },
        xAxis: {
          type: 'category',
          data: hours,
          splitArea: {
            show: true,
          },
        },
        yAxis: {
          type: 'category',
          data: days,
          splitArea: {
            show: true,
          },
        },
        visualMap: {
          min: 0,
          max: 6000,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%',
        },
        series: [
          {
            name: 'Reported',
            type: 'heatmap',
            data: data,
            label: {
              normal: {
                show: true,
              },
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    };

    $scope.prepareCountPerMonthPerYearVisualization = function() {
      var legend = _.map($scope.trending.countPerMonthPerYear, function(value) {
        return { name: value.year.toString(), icon: 'circle' };
      });

      var series = _.map($scope.trending.countPerMonthPerYear, function(value) {
        var monthlyCount = [
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
        ];
        _.forEach(_.sortBy(value.months, ['month']), function(value) {
          monthlyCount[value.month - 1] = value.count;
        });

        return {
          name: value.year,
          type: 'line',
          smooth: true,
          data: monthlyCount,
        };
      });

      var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      $scope.perMonthPerYearConfig = {
        height: 500,
        forceClear: true,
      };

      $scope.perMonthPerYearOptions = {
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        legend: {
          data: legend,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: months,
        },
        yAxis: {
          type: 'value',
        },
        series: series,
      };
    };

    $scope.prepare = function() {
      $scope.prepareCountPerHourPerDayVisualization();
      $scope.prepareCountPerMonthPerYearVisualization();
    };

    // reload trending data
    $scope.reload();
  });
