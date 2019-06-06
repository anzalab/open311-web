'use strict';

/**
 * @ngdoc directive
 * @name ng311.directive:LetterAvatar
 * @description
 * # LetterAvatar
 */
angular.module('ng311').directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind('keydown keypress', function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});
