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
  .controller('DashboardComparisonCtrl', function ($scope) {

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

    $scope.areaPerStatus = [{
        name: 'Ilala',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      },
      {
        name: 'Temeke',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      },
      {
        name: 'Kibaha',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      },
      {
        name: 'Kimara',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      },
      {
        name: 'Mbezi',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      },
      {
        name: 'Tegeta',
        open: 2,
        inprogress: 4,
        escallated: 5,
        closed: 40,
        resolved: 4,
        late: 45,
        total: 120
      }
    ];

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

  });
