'use strict';

/**
 * @ngdoc service
 * @name ng311.Summary
 * @description
 * # Summary
 * Factory in ng311
 * //TODO rename to reports
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


    /**
     * @description load all api endpoint in singe request to improve
     *              ui responsiveness
     * @param  {Object} params additional params
     * @return {Object}        
     */
    Summary.endpoints = function (params) {
      return $http.get(Utils.asLink('endpoints'), {
          params: params
        })
        .then(function (response) {
          return response.data;
        });
    };

    /**
     * @description load current overview/pipeline
     * @param  {Object} params additional params
     * @return {Object}        
     */
    Summary.overviews = function (params) {
      return $http.get(Utils.asLink('overviews'), {
          params: params
        })
        .then(function (response) {
          return response.data;
        });
    };

    /**
     * @description load current standings
     * @param  {Object} params additional params
     * @return {Object}        
     */
    Summary.standings = function (params) {
      return $http.get(Utils.asLink('standings'), {
          params: params
        })
        .then(function (response) {
          return response.data;
        });
    };

    return Summary;

  });
