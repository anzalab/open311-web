'use strict';

/**
 * @ngdoc service
 * @name ng311.Summary
 * @description
 * # Summary
 * Factory in ng311
 */
angular
  .module('ng311')
  .factory('Summary', function ($http, $resource, Utils) {
    var Summary = {};

    /**
     * @description find roles with pagination
     * @param  {Object} params [description]
     */
    Summary.issues = function (params) {
      return $http.get(Utils.asLink('summaries'), {
          params: params
        })
        .then(function (response) {
          return response.data;
        });
    };

    return Summary;
  });
