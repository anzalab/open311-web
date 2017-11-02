'use strict';


/**
 * @ngdoc function
 * @name ng311.controller:DashboardPerformanceCtrl
 * @description
 * # DashboardPerformanceCtrl
 * dashboard performance controller of ng311
 */


angular
  .module('ng311')
  .controller('DashboardPerformanceCtrl', function ($scope) {

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

    $scope.groups = [{
      count: 17,
      label: {
        name: 'Commercial'
      },
      displayColor: '#06C947'
    }, {
      count: 7,
      label: {
        name: 'Non Commercial'
      },
      displayColor: '#960F1E'
    }, {
      count: 5,
      label: {
        name: 'Illegal'
      },
      displayColor: '#263238'
    }, {
      count: 5,
      label: {
        name: 'Other'
      },
      displayColor: '#C8B1EF'
    }];

    $scope.performances = {
      works: {
        day: {
          count: 7,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString()
        },
        week: {
          count: 10,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString()
        },
        month: {
          count: 21,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString()
        }
      },
      durations: {
        day: {
          duration: {
            days: 0,
            hours: 0,
            minutes: 0,
            milliseconds: 0,
            seconds: 0
          },
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString()
        },
        week: {
          duration: {
            days: 0,
            hours: 0,
            minutes: 0,
            milliseconds: 0,
            seconds: 0
          },
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString()
        },
        month: {
          duration: {
            days: 0,
            hours: 0,
            minutes: 0,
            milliseconds: 0,
            seconds: 0
          },
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString()
        }
      }
    };

    $scope.performances.leaderboard = [{
        count: 400,
        party: {
          name: 'John Doe'
        }
      }, {
        count: 399,
        party: {
          name: 'John Doe'
        }
      },
      {
        count: 398,
        party: {
          name: 'John Doe'
        }
      }, {
        count: 397,
        party: {
          name: 'John Doe'
        }
      }, {
        count: 396,
        party: {
          name: 'John Doe'
        }
      }, {
        count: 395,
        party: {
          name: 'John Doe'
        }
      }, {
        count: 394,
        party: {
          name: 'John Doe'
        }
      }, {
        count: 393,
        party: {
          name: 'John Doe'
        }
      }
    ];

    $scope.performances.areaStandings = [{
        count: 400,
        party: {
          name: 'Ilala'
        }
      }, {
        count: 399,
        party: {
          name: 'Kinondoni'
        }
      },
      {
        count: 398,
        party: {
          name: 'Kibaha'
        }
      }, {
        count: 397,
        party: {
          name: 'Kimara'
        }
      }, {
        count: 396,
        party: {
          name: 'Magomeni'
        }
      }, {
        count: 395,
        party: {
          name: 'Tegeta'
        }
      }, {
        count: 394,
        party: {
          name: 'Temeke'
        }
      }, {
        count: 393,
        party: {
          name: 'Mbagala'
        }
      }
    ];
  });
