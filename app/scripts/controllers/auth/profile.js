'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:AuthProfileCtrl
 * @description
 * # AuthProfileCtrl
 * Controller of the ng311
 */
angular
  .module('ng311')
  .controller('AuthProfileCtrl', function (
    $rootScope, $scope, $state, $stateParams, $auth, $uibModal, Party, Summary
  ) {

    //signal if its editing process
    $scope.edit = false;

    $scope.canSave = true;

    $scope.passwordDontMatch = false;

    //use only editable properties
    $scope.party = new Party($rootScope.party);

    // create initial default filters
    var defaultFilters = {
      startedAt: ($stateParams.startedAt || moment().utc().startOf('date').toDate()),
      endedAt: ($stateParams.endedAt || moment().utc().endOf('date').toDate()),
    };

    $scope.filters = defaultFilters;

    //bind filters
    $scope.durationFilters = {
      durations: {
        day: {
          startedAt: moment().utc().startOf('date').toDate(),
          endedAt: moment().utc().endOf('date').toDate()
        },
        week: {
          startedAt: moment().utc().startOf('week').toDate(),
          endedAt: moment().utc().endOf('week').toDate()
        },
        month: {
          startedAt: moment().utc().startOf('month').toDate(),
          endedAt: moment().utc().endOf('month').toDate()
        }
      }
    };

    $scope.workFilters = {
      durations: {
        day: {
          startedAt: moment().utc().startOf('date').toDate(),
          endedAt: moment().utc().endOf('date').toDate()
        },
        week: {
          startedAt: moment().utc().startOf('week').toDate(),
          endedAt: moment().utc().endOf('week').toDate()
        },
        month: {
          startedAt: moment().utc().startOf('month').toDate(),
          endedAt: moment().utc().endOf('month').toDate()
        }
      }
    };


    $scope.onEdit = function () {
      $scope.edit = true;
    };


    $scope.onClose = function () {
      $scope.edit = false;
    };


    $scope.onConfirmPassword = function () {
      if (!$scope.party.confirm || !$scope.party.password) {
        $scope.passwordDontMatch = false;
      } else {
        $scope.passwordDontMatch = !($scope.party.password === $scope.party
          .confirm);
        $scope.canSave =
          ($scope.party.password.length >= 8) &&
          ($scope.party.password === $scope.party.confirm);
      }
    };


    $scope.onPasswordChange = function () {
      if (!$scope.party.password) {
        $scope.canSave = true;
      } else {
        $scope.canSave =
          ($scope.party.password.length >= 8) &&
          ($scope.party.password === $scope.party.confirm);
      }
    };


    /**
     * @description save edited customer
     */
    $scope.save = function () {
      //check if password edited
      var passwordChanged = !!$scope.party.password;

      //TODO show input prompt
      //TODO show loading mask
      $scope.party.$update().then(function (response) {
        if (passwordChanged) {
          //signout current party
          return $auth.signout();
        } else {
          return response;
        }
      })
        .then(function (response) {
          response = response || {};

          response.message =
            response.message || 'Profile details updated successfully';

          $scope.edit = false;

          $rootScope.$broadcast('appSuccess', response);

          if (passwordChanged) {
            $state.go('signin');
          } else {
            $state.go('app.profile');
          }
        })
        .catch(function (error) {
          $rootScope.$broadcast('appError', error);
          $state.go('app.profile');
        });
    };


    $scope.performance = function () {
      var params = _.merge({}, { query: $scope.params }, {
        _id: $scope.party._id
      });

      Party.performances(params).then(function (response) {
        //TODO comment
        response.pipelines =
          _.chain(response.pipelines)
            .orderBy('label.weight', 'asc')
            .map(function (pipeline) {
              return _.merge({}, {
                displayColor: _.get(pipeline, 'label.color',
                  '#4BC0C0') + '!important'
              }, pipeline);
            }).value();

        response.leaderboard =
          _.orderBy(response.leaderboard, 'count', 'desc');
        $scope.performances = response;
        $scope.performances.overall = { count: 10, pending: 5, resolved: 5, late: 0, target: 0 };
        $scope.performances.attendTime = { max: { days: 0, hours: 0, minutes: 0, seconds: 0 }, min: { days: 0, hours: 0, minutes: 0, seconds: 0 }, average: { days: 0, hours: 0, minutes: 0, seconds: 0 }, target: { days: 0, hours: 0, minutes: 0, seconds: 0 } };
        $scope.performances.resolveTime = { max: { days: 0, hours: 0, minutes: 0, seconds: 0 }, min: { days: 0, hours: 0, minutes: 0, seconds: 0 }, average: { days: 0, hours: 0, minutes: 0, seconds: 0 }, target: { days: 0, hours: 0, minutes: 0, seconds: 0 } };
        $scope.performances.breakdown = [
          { name: 'Billing', total: 14, open: 2, inprogress: 5, close: 2, resolved: 5 },
          { name: 'Water Leakage', total: 14, open: 2, inprogress: 5, close: 2, resolved: 5 },
          { name: 'Adjustment BTN', total: 14, open: 2, inprogress: 5, close: 2, resolved: 5 },
          { name: 'Un registered Customer', total: 14, open: 2, inprogress: 5, close: 2, resolved: 5 },
          { name: 'New Connection', total: 14, open: 2, inprogress: 5, close: 2, resolved: 5 },
          { name: 'Wrong Reading', total: 14, open: 2, inprogress: 5, close: 2, resolved: 5 },
          { name: 'Wrong Reading', total: 14, open: 2, inprogress: 5, close: 2, resolved: 5 },
          { name: 'Wrong Reading', total: 14, open: 2, inprogress: 5, close: 2, resolved: 5 },
          { name: 'Wrong Reading', total: 14, open: 2, inprogress: 5, close: 2, resolved: 5 },
          { name: 'Wrong Reading', total: 14, open: 2, inprogress: 5, close: 2, resolved: 5 },
          { name: 'Wrong Reading', total: 14, open: 2, inprogress: 5, close: 2, resolved: 5 },
        ];
      });
    };


    /**
     * Open date filters for profile reports
     */
    $scope.showFilter = function () {

      //open overview reports filter modal
      $scope.modal = $uibModal.open({
        templateUrl: 'views/auth/_partials/profile_filter.html',
        scope: $scope,
        size: 'lg',
      });

      //handle modal close and dismissed
      $scope.modal.result.then(function onClose( /*selectedItem*/) { },
        function onDismissed() { });

    };

    /**
     * Filter profile reports based on on current selected filters
     * @param {Boolean} [reset] whether to clear and reset filter
     */
    $scope.filter = function (reset) {

      if (reset) {
        $scope.filters = defaultFilters;
      }

      $scope.params = Summary.prepareQuery($scope.filters);

      //load reports
      $scope.performance();

      //close current modal
      $scope.modal.close();

    };

    $scope.performance();

  });
