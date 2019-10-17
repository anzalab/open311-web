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

    /**
     * @function
     * @name prepareCountPerHourPerDayVisualization
     * @description Prepare heat map of reported issues per hour per day
     *
     * @version 0.1.0
     * @since 0.1.0
     */
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

    /**
     * @function
     * @name prepareCountPerMonthPerYearVisualization
     * @description Prepare trending line chart for reported issues per month per year
     *
     * @version 0.1.0
     * @since 0.1.0
     */
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

    /**
     * @function
     * @name prepareQuarterlyPerYearVisualization
     * @description Prepare visualization for quarterly reported issues per year
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    $scope.prepareQuarterlyPerYearVisualization = function() {
      console.log($scope.trending);
      var Q1 = [7, 8, 9];
      var Q2 = [10, 11, 12];
      var Q3 = [1, 2, 3];
      var Q4 = [4, 5, 6];

      var series1 = ['Quarter 1'];
      var series2 = ['Quarter 2'];
      var series3 = ['Quarter 3'];
      var series4 = ['Quarter 4'];

      var years = _.map($scope.trending.countPerMonthPerYear, function(value) {
        return value.year.toString();
      });

      var legend = ['Years'].concat(years);
      console.log(legend);

      console.log(_.sortBy($scope.trending.countPerMonthPerYear, ['year']));

      _.forEach(
        _.sortBy($scope.trending.countPerMonthPerYear, ['year']),
        function(value) {
          var q1 = 0;
          var q2 = 0;
          var q3 = 0;
          var q4 = 0;
          _.forEach(value.months, function(value) {
            if (Q1.includes(value.month)) {
              q1 += value.count;
            } else if (Q2.includes(value.month)) {
              q2 += value.count;
            } else if (Q3.includes(value.month)) {
              q3 += value.count;
            } else if (Q4.includes(value.month)) {
              q4 += value.count;
            }
          });

          series1.push(q1);
          series2.push(q2);
          series3.push(q3);
          series4.push(q4);
        }
      );

      $scope.perQuarterPerYearConfig = {
        height: 600,
        forceClear: true,
      };

      console.log([legend, series1, series2, series3, series4]);

      $scope.perQuarterPerYearOptions = {
        legend: {},
        tooltip: {},
        dataset: {
          source: [legend, series1, series2, series3, series4],
        },
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
      };
    };

    $scope.prepare = function() {
      $scope.prepareCountPerHourPerDayVisualization();
      $scope.prepareCountPerMonthPerYearVisualization();
      $scope.prepareQuarterlyPerYearVisualization();
    };

    // reload trending data
    $scope.reload();
  });
