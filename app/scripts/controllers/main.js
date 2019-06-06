'use strict';

/**
 * @ngdoc function
 * @name ng311.controller:MainCtrl
 * @description root controller for all ng311 controllers
 * # MainCtrl
 * Controller of the ng311
 */
angular
  .module('ng311')
  .controller('MainCtrl', function(
    $rootScope,
    $scope,
    $state,
    ngNotify,
    ngToast,
    socket
  ) {
    //TODO show signin progress

    $scope.onAllIssues = function() {
      $rootScope.$broadcast('servicerequest:list');
    };

    //show app aside
    $rootScope.showAside = true;

    //handle fired error events
    function onError(event, error) {
      var message = 'Operation failed';

      if (error.status === -1) {
        message = 'No network connection';
      }

      try {
        message = error.message || error.data.message;
      } catch (e) {}

      ngNotify.set(message, {
        position: 'top',
        type: 'warn',
      });
    }

    //handle fired success events
    function onSuccess(event, success) {
      var message = 'Operation occured successfully';

      try {
        message = success.message;
      } catch (e) {}

      ngNotify.set(message, {
        position: 'top',
        type: 'success',
      });
    }

    //handle fired warning events
    function onWarning(event, warning) {
      var message = 'Operation Not Completed';

      try {
        message = warning.message;
      } catch (e) {}

      ngNotify.set(message, {
        position: 'top',
        type: 'warn',
        button: true,
        sticky: true,
        dismissButton: true,
      });
    }

    //listen errors and notify
    $rootScope.$on('appError', onError);
    $rootScope.$on('signinError', onError);

    //listen success and notify
    $rootScope.$on('appSuccess', onSuccess);

    //listen warning and notify
    $rootScope.$on('appWarning', onWarning);

    //TODO fire welcome message
    // $rootScope.$on('signinSuccess', onSuccess);

    /**
     * @description show and hide application aside
     */
    $scope.switch = function() {
      var pageAside = angular.element('.page-aside');
      var isOpen = pageAside.hasClass('open');

      if (isOpen) {
        pageAside.removeClass('open');
      } else {
        pageAside.addClass('open');
      }
    };

    /**
     * listen to signin success event
     */
    $rootScope.$on('signinSuccess', function(event, response) {
      //obtain signin party(user)
      var party = _.get(response, 'data.party');

      //if party is operator and has sipNumber
      //subscribe to web socket for call picked events
      if (socket && party && socket.on && party.sipNumber) {
        //ensure socket connection
        // socket.connect();

        //prepare sip socket event name
        $rootScope.sipEvent = ['socket:', party.sipNumber, '-call-picked'].join(
          ''
        );

        socket.on($rootScope.sipEvent, function(data) {
          //notify new call
          ngToast.create({
            className: 'info',
            content: 'New Call Received',
            dismissButton: true,
          });

          //broadcast call picked
          $rootScope.$broadcast('call picked', data);

          //TODO save latest call data on local storage for new
          //call creation
        });
      }
    });

    /**
     * listen to signout success event
     */
    $rootScope.$on('signoutSuccess', function() {
      //disconnect from call picked socket event
      if (socket && socket.disconnect) {
        if ($rootScope.sipEvent) {
          socket.removeListener($rootScope.sipEvent);
        }

        // socket.removeAllListeners();

        // socket.disconnect();
      }
    });
  });
