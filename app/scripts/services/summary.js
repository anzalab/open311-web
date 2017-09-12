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
      return $http.get(Utils.asLink(['reports', 'overviews']), {
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
      return $http.get(Utils.asLink(['reports', 'standings']), {
          params: params
        })
        .then(function (response) {
          return response.data;
        });
    };

    /**
     * Build params as per API filtering, sorting and paging
     * @param  {Object} [params] reports filters
     * @return {Object}
     */
    Summary.prepareQuery = function (params) {
      //ensure params
      params = _.merge({}, params);

      //initialize query
      var query = {};

      //1. ensure start and end dates
      //1.0 ensure start date
      params.startedAt =
        (params.startedAt ? moment(new Date(params.startedAt)).utc().startOf(
          'date') : moment().utc().startOf('date'));
      //1.1 ensure end date
      params.endedAt =
        (params.endedAt ? moment(new Date(params.endedAt)).utc().endOf(
          'date') : moment().utc().endOf('date'));
      //1.2 ensure start is less than end
      var startedAt = params.startedAt;
      if (params.startedAt.isAfter(params.endedAt)) {
        params.startedAt = params.endedAt;
        params.endedAt = startedAt;
      }
      //1.3 build start & end date criteria
      query.createdAt = {
        $gte: params.startedAt.startOf('date').toDate(),
        $lte: params.endedAt.endOf('date').toDate()
      };


      //2. ensure jurisdictions
      //2.0 normalize & compact jurisdictions
      params.jurisdictions = _.uniq(_.compact([].concat(params.jurisdictions)));
      //2.1 build jurisdiction criteria
      if (params.jurisdictions.length >= 1) {
        if (params.jurisdictions.length > 1) {
          //use $in criteria
          query.jurisdiction = { $in: params.jurisdictions };
        } else {
          //use $eq criteria
          query.jurisdiction = _.first(params.jurisdictions);
        }
      }

      //ensure service groups
      //3. ensure servicegroups
      //3.0 normalize & compact servicegroups
      params.servicegroups = _.uniq(_.compact([].concat(params.servicegroups)));
      //3.1 build group criteria
      if (params.servicegroups.length >= 1) {
        if (params.servicegroups.length > 1) {
          //use $in criteria
          query.group = { $in: params.servicegroups };
        } else {
          //use $eq criteria
          query.group = _.first(params.servicegroups);
        }
      }

      //ensure services
      //4. ensure services
      //4.0 normalize & compact services
      params.services = _.uniq(_.compact([].concat(params.services)));
      //4.1 build service criteria
      if (params.services.length >= 1) {
        if (params.services.length > 1) {
          //use $in criteria
          query.service = { $in: params.services };
        } else {
          //use $eq criteria
          query.service = _.first(params.services);
        }
      }

      //ensure statuses
      //5. ensure statuses
      //5.0 normalize & compact statuses
      params.statuses = _.uniq(_.compact([].concat(params.statuses)));
      //5.1 build status criteria
      if (params.statuses.length >= 1) {
        if (params.statuses.length > 1) {
          //use $in criteria
          query.status = { $in: params.statuses };
        } else {
          //use $eq criteria
          query.status = _.first(params.statuses);
        }
      }

      //ensure priorities
      //6. ensure priorities
      //6.0 normalize & compact priorities
      params.priorities = _.uniq(_.compact([].concat(params.priorities)));
      //6.1 build priority criteria
      if (params.priorities.length >= 1) {
        if (params.priorities.length > 1) {
          //use $in criteria
          query.priority = { $in: params.priorities };
        } else {
          //use $eq criteria
          query.priority = _.first(params.priorities);
        }
      }

      return query;

    };

    return Summary;

  });
