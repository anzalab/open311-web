'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:DashboardComparisonCtrl
 * @description
 * # DashboardComparisonCtrl
 * dashboard daily comparison controller of ng311
 */


angular
  .module('ng311')
  .controller('DashboardComparisonCtrl', function ($scope, Summary) {

    $scope.reload = function () {
      Summary
        .standings()
        .then(function (standings) {
          $scope.standings = standings;

          $scope.prepare();
          console.log(standings);
        });
    };

    // prepare standing report data in a preferable format
    $scope.prepare = function () {
      $scope.prepareAreaPerStatus();
      $scope.prepareAreaPerServiceGroup();
    };


    $scope.prepareAreaPerStatus = function () {

      var areas = _.chain($scope.standings)
        .map('jurisdiction')
        .uniqBy('name')
        .sortBy('name')
        .value();

      $scope.statuses = _.chain($scope.standings)
        .map('status')
        .uniqBy('name')
        .sortBy('weight')
        .value();

      // data which will be displayed
      var data = [];
      _.forEach(areas, function (area) {
        var jurisdiction = {};
        jurisdiction.total = 0;
        jurisdiction.statuses = [];
        _.forEach($scope.statuses, function (status) {

          // filter all data from same jurisdiction and with the same status name
          var value = _.filter($scope.standings, function (standing) {
            return standing.jurisdiction.name === area.name &&
              standing.status.name === status.name;
          });

          value = value ? _.sumBy(value, 'count') : 0;

          status = _.merge({}, status, {
            count: value,
          });

          jurisdiction.total += value;
          // add array of statuses into jurisdiction data object
          jurisdiction.statuses.push(status);

        });

        jurisdiction.statuses = _.sortBy(jurisdiction.statuses,
          'weight');

        jurisdiction.name = area.name;

        data.push(jurisdiction);
      });


      // create last Row which is the summation of all areas based on statuses
      var lastRow = {};
      lastRow.name = 'Total';
      lastRow.statuses = [];
      lastRow.total = 0;

      _.forEach($scope.statuses, function (status) {

        // filter all data from same jurisdiction and with the same status name
        var value = _.filter($scope.standings, function (standing) {
          return standing.status.name === status.name;
        });

        value = value ? _.sumBy(value, 'count') : 0;

        lastRow.total += value;

        status = _.merge({}, status, {
          count: value,
        });

        lastRow.statuses.push(status);

      });

      data.push(lastRow);

      $scope.areaPerStatus = data;
    };

    $scope.preparePipeline = function () {
      var data = [];
      var total = 0;

      _.forEach($scope.statuses, function (status) {

        // filter all data from same jurisdiction and with the same status name
        var value = _.filter($scope.standings, function (standing) {
          return standing.status.name === status.name;
        });

        value = value ? _.sumBy(value, 'count') : 0;

        total += value;

        status = _.merge({}, status, {
          count: value,
        });

        data.push(status);
      });



    };

    $scope.prepareAreaPerServiceGroup = function () {

      var areas = _.chain($scope.standings)
        .map('jurisdiction')
        .uniqBy('name')
        .sortBy('name')
        .value();

      // service groups
      $scope.groups = _.chain($scope.standings)
        .map('group')
        .uniqBy('name')
        .sortBy('name')
        .value();

      var data = [];

      _.forEach(areas, function (area) {
        var jurisdiction = {};
        jurisdiction.name = area.name;
        jurisdiction.groups = [];
        jurisdiction.total = 0;
        _.forEach($scope.groups, function (group) {

          var value = _.filter($scope.standings, function (standing) {
            return standing.jurisdiction.name === area.name &&
              standing.group.name === group.name;
          });



          value = value ? _.sumBy(value, 'count') : 0;

          group = _.merge({}, group, {
            count: value
          });

          jurisdiction.groups.push(group);

          jurisdiction.total += value;
        });

        data.push(jurisdiction);
      });


      // prepare last Row
      var lastRow = {};
      lastRow.name = 'Total';
      lastRow.groups = [];
      lastRow.total = 0;

      _.forEach($scope.groups, function (group) {

        var value = _.filter($scope.standings, function (standing) {
          return standing.group.name === group.name;
        });

        value = value ? _.sumBy(value, 'count') : 0;

        group = _.merge({}, group, {
          count: value
        });

        lastRow.groups.push(group);

        lastRow.total += value;
      });

      data.push(lastRow);

      console.log(data);
      $scope.areaPerServiceGroup = data;
    };


    // dummy data
    $scope.pipelines = [{
      count: 17,
      label: {
        name: 'Total'
      },
      displayColor: '#4BC0C0'
    }, {
      count: 7,
      label: {
        name: 'Open'
      },
      displayColor: '#0D47A1'
    }, {
      count: 5,
      label: {
        name: 'In Progress'
      },
      displayColor: '#1B5E20'
    }, {
      count: 5,
      label: {
        name: 'Escallated'
      },
      displayColor: '#EF6C00'
    }, {
      count: 5,
      label: {
        name: 'Closed'
      },
      displayColor: '#1B5E20'
    }];


    $scope.areaPerServiceGroup = [{
        name: 'Ilala',
        commercial: 2,
        noncommercial: 4,
        illegal: 5,
        other: 40,
        total: 120
      },
      {
        name: 'Temeke',
        commercial: 2,
        noncommercial: 4,
        illegal: 5,
        other: 40,
        total: 120
      },
      {
        name: 'Kibaha',
        commercial: 2,
        noncommercial: 4,
        illegal: 5,
        other: 40,
        total: 120
      },
      {
        name: 'Kimara',
        commercial: 2,
        noncommercial: 4,
        illegal: 5,
        other: 40,
        total: 120
      },
      {
        name: 'Mbezi',
        commercial: 2,
        noncommercial: 4,
        illegal: 5,
        other: 40,
        total: 120
      },
      {
        name: 'Tegeta',
        commercial: 2,
        noncommercial: 4,
        illegal: 5,
        other: 40,
        total: 120
      }
    ];

    $scope.servicesPerStatus = [{
        name: 'Billing',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      },
      {
        name: 'Lack of Water',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      },
      {
        name: 'Meter Problem',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      },
      {
        name: 'Others',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      },
      {
        name: 'Billing',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      },
      {
        name: 'Billing',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      }
    ];

    $scope.areaPerService = {
      areas: ['Boko', 'Temeke', 'Kinondoni', 'Kibaha', 'Kimara', 'Mbezi',
        'Total'
      ],
      services: [{
        name: 'Billing',
        counts: [12, 43, 23, 21, 43, 12],
        total: 200
      }, {
        name: 'Lack of Water',
        counts: [12, 34, 634, 34, 23, 12],
        total: 304
      }, {
        name: 'Meter Problems',
        counts: [12, 34, 634, 34, 23, 12],
        total: 400
      }]
    };


    $scope.serviceGroupPerStatus = [{
      name: 'Commercial',
      open: 2,
      inprogress: 4,
      escallated: 5,
      closed: 40,
      resolved: 4,
      late: 45,
      total: 120
    }, {
      name: 'Non Commercial',
      open: 2,
      inprogress: 4,
      escallated: 5,
      closed: 40,
      resolved: 4,
      late: 45,
      total: 120
    }, {
      name: 'Illegal',
      open: 2,
      inprogress: 4,
      escallated: 5,
      closed: 40,
      resolved: 4,
      late: 45,
      total: 120
    }, {
      name: 'Other',
      open: 2,
      inprogress: 4,
      escallated: 5,
      closed: 40,
      resolved: 4,
      late: 45,
      total: 120
    }];


    // reload standing data
    $scope.reload();


  });
