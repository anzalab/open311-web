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
    $rootScope, $scope, $state, $auth, $uibModal, Party
  ) {

    //signal if its editing process
    $scope.edit = false;

    $scope.canSave = true;

    $scope.passwordDontMatch = false;

    //use only editable properties
    $scope.party = new Party($rootScope.party);

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
      var params = {
        _id: $scope.party._id
      };

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
        console.log(response);
        $scope.performances = response;
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
        //TODO clear filters
      }
    };

    $scope.performance();

  });
