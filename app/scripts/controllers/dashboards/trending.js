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
        console.log(trending);

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

    $scope.prepare = function() {
      $scope.prepareCountPerHourPerDayVisualization();
    };

    // reload trending data
    $scope.reload();
  });
