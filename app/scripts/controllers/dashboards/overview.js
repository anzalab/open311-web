'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:DashboardOverviewCtrl
 * @description
 * # DashboardOverviewCtrl
 * Service Request controller of ng311
 */
angular
  .module('ng311')
  .controller('DashboardOverviewCtrl', function (
    $rootScope, $scope, $state, Summary, overviews
  ) {

    console.log(overviews);

    //initialize overview
    $scope.overviews = overviews;

    $scope.prepare = function () {
      //obtain issues summary
      $scope.issues = overviews.issues;

      //TODO prepare issue based on service category

      $scope.prepareIssueByJurisdiction();

      $scope.prepareIssueByService();

      $scope.prepareIssueByStatus();

      $scope.prepareIssueByPriority();

    };


    $scope.prepareIssueByStatus = function () {

      var statuses = _.map($scope.overviews.statuses, 'status');

      $scope.statusConfig = {
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
        calculable: true
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
        calculable: true
      };

      $scope.priorityData = [{
        datapoints: _.map($scope.overviews.priorities, function (
          priority) {
          return { x: priority.priority, y: priority.count };
        })
      }];

    };


    $scope.prepareIssueByService = function () {

      var services = _.map($scope.overviews.services, 'service');

      $scope.serviceConfig = {
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
          data: services
        },
        calculable: true
      };

      $scope.serviceData = [{
        datapoints: _.map($scope.overviews.services, function (
          service) {
          return { x: service.service, y: service.count };
        })
      }];

    };


    $scope.prepareIssueByJurisdiction = function () {

      var jurisdictions = _.map($scope.overviews.jurisdictions,
        'jurisdiction');

      $scope.jurisdictionConfig = {
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
          data: jurisdictions
        },
        calculable: true
      };

      $scope.jurisdictionData = [{
        datapoints: _.map($scope.overviews.jurisdictions, function (
          jurisdiction) {
          return { x: jurisdiction.jurisdiction, y: jurisdiction.count };
        })
      }];

    };



    //listen for events and reload overview accordingly
    $rootScope.$on('app:servicerequests:reload', function () {
      Summary.overviews().then(function (overviews) {
        $scope.overviews = overviews;
        $scope.prepare();
      });
    });

    //prepare overview details
    $scope.prepare();

  });
