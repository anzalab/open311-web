'use strict';

/**
 * @ngdoc service
 * @name ng311.Utils
 * @description
 * # Utils
 * Factory in the ng311.
 */
angular.module('ng311')
  .factory('Utils', function (ENV) {
    var utils = {};

    /**
     * @description convert provided path to link
     * @param  {String|Array} path valid url
     * @return {String}
     */
    utils.asLink = function (path) {
      if (!angular.isArray(path)) {
        path = [path];
      }
      var asLink = [ENV.apiEndPoint.web];
      asLink = asLink.concat(path);
      return asLink.join('/');
    };

    return utils;
  });
