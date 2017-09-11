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
    $rootScope, $scope, $state, $uibModal, Summary, endpoints, overviews
  ) {

    //initialize scope attributes
    $scope.startedAt;
    $scope.endedAt;
    $scope.maxDate = new Date();

    //bind states
    $scope.priorities = endpoints.priorities.priorities;
    $scope.statuses = endpoints.statuses.statuses;
    $scope.services = endpoints.services.services;
    $scope.jurisdictions = endpoints.jurisdictions.jurisdictions;

    /**
     * prepare multi series data
     * @param {[Object]} data series value to prepare
     * @return {[[Object]]} valid multi series data 
     */
    $scope.prepareMultiSeries = function (values) {

      values = _.map(values, function (value) {
        return {
          name: value.name,
          type: 'bar',
          datapoints: [{
            x: value.name,
            y: value.value
          }]
        };
      });

      return values;

    };

    //initialize overview
    $scope.overviews = overviews;


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
      console.log(reset);
      //TODO load reports
      //close current modal
      $scope.modal.close();
    };


    $scope.prepare = function () {
      //obtain issues summary
      $scope.issues = overviews.issues;

      //TODO add date filter default to today

      $scope.prepareIssueByJurisdiction();

      $scope.prepareIssueByService();

      $scope.prepareIssueByServiceGroup();

      $scope.prepareIssueByStatus();

      $scope.prepareIssueByPriority();

    };


    $scope.prepareIssueByStatus = function () {

      var statuses = _.map($scope.overviews.statuses, 'status');

      $scope.statusConfig = {
        textStyle: {
          fontFamily: 'Lato'
        },
        radius: '55%',
        center: ['50%', '60%'],
        height: 300,
        width: 500,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: statuses
        },
        calculable: true,
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Issue per Status-' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        }
      };

      $scope.statusData = [{
        datapoints: _.map($scope.overviews.statuses, function (status) {
          return { x: status.status, y: status.count };
        })
      }];

    };


    $scope.prepareIssueByPriority = function () {

      var priorities = _.map($scope.overviews.priorities, 'priority');

      $scope.priorityConfig = {
        textStyle: {
          fontFamily: 'Lato'
        },
        radius: '55%',
        center: ['50%', '60%'],
        height: 300,
        width: 500,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: priorities
        },
        calculable: true,
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Issue per Priority-' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        }
      };

      $scope.priorityData = [{
        datapoints: _.map($scope.overviews.priorities, function (
          priority) {
          return { x: priority.priority, y: priority.count };
        })
      }];

    };


    $scope.prepareIssueByService = function () {

      //prepare values for bar chart
      var services = _.map(
        $scope.overviews.services,
        function (service) {
          return {
            name: service.service,
            value: service.count,
            itemStyle: {
              normal: {
                color: service.color
              }
            }
          };
        });

      $scope.serviceConfig = {
        height: 1000,
        width: 960
      };

      $scope.serviceOptions = {
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
              name: 'Issue per Service-' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        },
        grid: {
          left: '3%',
          containLabel: true
        },
        yAxis: [{
          type: 'category',
          data: _.map(services, 'name'),
          axisTick: {
            alignWithLabel: true
          }
        }],
        xAxis: [{
          type: 'value'
        }],
        series: [{
          type: 'bar',
          barWidth: '60%',
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
          data: services
        }]
      };

    };


    $scope.prepareIssueByServiceGroup = function () {

      var groups = _.map($scope.overviews.groups, 'group');

      $scope.groupConfig = {
        textStyle: {
          fontFamily: 'Lato'
        },
        radius: '70%',
        center: ['50%', '50%'],
        height: 300,
        width: 960,
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          y: 'top',
          data: groups
        },
        calculable: true,
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'Issue per Service Group-' + new Date().getTime(),
              title: 'Save',
              show: true
            }
          }
        }
      };

      $scope.groupData = [{
        datapoints: _.map($scope.overviews.groups, function (
          group) {
          return { x: group.group, y: group.count };
        })
      }];

    };


    $scope.prepareIssueByJurisdiction = function () {

      //prepare values for bar chart
      var jurisdictions = _.map(
        $scope.overviews.jurisdictions,
        function (jurisdiction) {
          return {
            name: jurisdiction.jurisdiction,
            value: jurisdiction.count,
            itemStyle: {
              normal: {
                color: jurisdiction.color
              }
            }
          };
        });

      $scope.jurisdictionConfig = {
        height: 360,
        width: 960
      };

      $scope.jurisdictionOptions = {
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
        xAxis: [{
          type: 'category',
          data: _.map(jurisdictions, 'name'),
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
          data: jurisdictions
        }]
      };

    };


    //listen for events and reload overview accordingly
    $rootScope.$on('app:servicerequests:reload', function () {
      Summary.overviews().then(function (overviews) {
        $scope.overviews = overviews;
        $scope.prepare();
      });
    });


    //on load
    //prepare overview details
    $scope.prepare();


  });
