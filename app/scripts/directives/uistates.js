'use strict';

/**
 * @summary ShowIfState directive
 * @function
 * @public
 *
 * @description
 * This directive provides an attribute to show an element
 * when the current UI Router state matches the specified one.
 *
 * @param {Object} $state - ui router $state
 * @returns {Object} directive
 *
 * @example
 * <button show-if-state="main" ui-sref="settings">Settings</button>
 */
angular
  .module('ng311')
  .directive('showIfState', function ($state) {
    return {
      restrict: 'A',
      scope: {
        showIfState: '@'
      },
      link: function (scope, element) {
        scope.$watch(function () {
          return $state.is(scope.showIfState);
        }, function (isState) {

          if (isState) {
            element.css('display', 'initial');
          } else {
            element.css('display', 'none');
          }

        });
      }
    };
  });


/**
 * @summary HideIfState directive
 * @function
 * @public
 *
 * @description
 * This directive provides an attribute to hide an element
 * when the current UI Router state matches the specified one.
 *
 * @param {Object} $state - ui router $state
 * @returns {Object} directive
 *
 * @example
 * <button hide-if-state="settings" ui-sref="main">Go Back</button>
 */
angular
  .module('ng311')
  .directive('hideIfState', function ($state) {
    return {
      restrict: 'A',
      scope: {
        hideIfState: '@'
      },
      link: function (scope, element) {
        scope.$watch(function () {
          return $state.is(scope.hideIfState);
        }, function (isState) {

          if (isState) {
            element.css('display', 'none');
          } else {
            element.css('display', 'initial');
          }

        });
      }
    };
  });
