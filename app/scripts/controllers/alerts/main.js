'use strict';

/**
 * @ngdoc function
 * @name ng311.controller.AlertMainCtrl
 * @description
 * Alert Main Controller
 */
angular
  .module('ng311')
  .controller('AlertMainCtrl', function ($scope, $uibModal) {

    $scope.alerts = [
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
      { title: 'Water Cut', type: 'SMS', status: 'Sent', priority: 'High', sentAt: new Date(), message: 'It sounds like you have multiple branches for different cycles of a change. I do not know what your cycles are, but lets assume they are yoy', totalSent: 1000, area: 'Ilala' },
    ];

    $scope.jurisdictions = [
      { name: 'Ilala' },
      { name: 'Tegeta' },
      { name: 'Bagamoyo' },
      { name: 'Tegeta' },
      { name: 'Temeke' },
    ];

    $scope.methods = [
      { name: 'SMS' },
      { name: 'Email' },
      { name: 'Push Notification' },
    ];

    $scope.priorities = [
      { name: 'High', count: 100 },
      { name: 'Normal', count: 100 },
      { name: 'Low', count: 100 },
    ];

    $scope.statuses = [
      { name: 'Sent', count: 100 },
      { name: 'Queued', count: 100 },
      { name: 'Failed', count: 100 },
      { name: 'Delivered', count: 100 },
    ];

    $scope.types = [
      { name: 'SMS', count: 100 },
      { name: 'Email', count: 100 },
      { name: 'Push', count: 100 },
    ];

    /**
     * Open model to compose
     * @function
     * @name compose
     */
    $scope.compose = function () {
      //open performance reports filter modal
      $scope.modal = $uibModal.open({
        templateUrl: 'views/alerts/_partials/compose.html',
        scope: $scope,
        size: 'lg',
      });

      //handle modal close and dismissed
      $scope.modal.result.then(function onClose( /*selectedItem*/) { },
        function onDismissed() { });
    };
  });
