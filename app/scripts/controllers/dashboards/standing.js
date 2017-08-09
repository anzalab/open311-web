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

    $scope.prepare = function () {

      //TODO add date filter default to today

      $scope.prepareIssuePerJurisdictionPerStatus();

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
          var value =
            _.filter($scope.standings, function (standing) {
              return (standing.jurisdiction.name === category &&
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

      $scope.perJurisdictionPerStatusConfig = {
        height: 400,
        width: 1200
      };

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


    //listen for events and reload overview accordingly
    $rootScope.$on('app:servicerequests:reload', function () {
      Summary.standings().then(function (standings) {
        $scope.standings = standings;
        $scope.prepare();
      });
    });


    //on load
    //prepare overview details
    $scope.prepare();


  });
