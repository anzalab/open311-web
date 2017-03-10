'use strict';

/**
 * @ngdoc function
 * @name ng311.states:Setting
 * @description
 * Setting states configuration of ng311 
 */
angular
  .module('ng311')
  .config(function ($stateProvider) {

    //setting management states
    $stateProvider
      .state('app.manage.settings', {
        url: '/settings',
        templateUrl: 'views/settings/index.html',
        controller: 'SettingIndexCtrl',
        data: {
          authenticated: true
        }
      });
  });
