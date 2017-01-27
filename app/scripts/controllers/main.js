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
  .controller('MainCtrl', function ($rootScope, $scope, ngNotify) {
    //TODO show signin progress

    $scope.onCreateIssue = function () {
      $rootScope.$broadcast('servicerequest:create');
    };

    $scope.onAllIssues = function () {
      $rootScope.$broadcast('servicerequest:list');
    };

    //replace browser scroll with richer scroller
    // angular.element('html').niceScroll({
    //   cursorcolor: '#A3AFB7',
    //   cursorwidth: '6px'
    // });

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
        type: 'warn'
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
        type: 'success'
      });

    }

    //listen errors and notify
    $rootScope.$on('appError', onError);
    $rootScope.$on('signinError', onError);

    //listen success and notify
    $rootScope.$on('appSuccess', onSuccess);

    //TODO fire welcome message
    // $rootScope.$on('signinSuccess', onSuccess);

    /**
     * @description show and hide application aside
     */
    $scope.switch = function () {

      var pageAside = angular.element('.page-aside');
      var isOpen = pageAside.hasClass('open');

      if (isOpen) {
        pageAside.removeClass('open');
      } else {
        pageAside.addClass('open');
      }
    };

  });
