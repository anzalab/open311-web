'use strict';

/**
 * @ngdoc service
 * @name ng311.Summary
 * @description
 * # Summary
 * Factory in ng311
 * //TODO rename to reports
 */
angular.module('ng311').factory('Summary', function($http, $resource, Utils) {
  var Summary = {};

  /**
   * @description find roles with pagination
   * @param  {Object} params [description]
   */
  Summary.issues = function(params) {
    return $http
      .get(Utils.asLink('summaries'), {
        params: params,
      })
      .then(function(response) {
        return response.data;
      });
  };

  /**
   * @description load all api endpoint in singe request to improve
   *              ui responsiveness
   * @param  {Object} params additional params
   * @return {Object}
   */
  Summary.endpoints = function(params) {
    return $http
      .get(Utils.asLink('endpoints'), {
        params: params,
      })
      .then(function(response) {
        return response.data;
      });
  };

  /**
   * @description load current overview/pipeline
   * @param  {Object} params additional params
   * @return {Object}
   */
  Summary.overviews = function(params) {
    return $http
      .get(Utils.asLink(['v1', 'reports', 'overviews']), {
        params: params,
      })
      .then(function(response) {
        return response.data.data;
      });
  };

  /**
   * @description load current standings
   * @param  {Object} params additional params
   * @return {Object}
   */
  Summary.standings = function(params) {
    return $http
      .get(Utils.asLink(['v1', 'reports', 'standings']), {
        params: params,
      })
      .then(function(response) {
        return response.data.data;
      });
  };

  /**
   * @description load current performances
   * @param  {Object} params additional params
   * @return {Object}
   */
  Summary.performances = function(params) {
    return $http
      .get(Utils.asLink(['v1', 'reports', 'performances']), {
        params: params,
      })
      .then(function(response) {
        return response.data.data;
      });
  };

  /**
   * @description Load current operations report
   * @param {object} params additional params
   * @return {object}
   */
  Summary.operations = function(params) {
    return $http
      .get(Utils.asLink(['v1', 'reports', 'operations']), {
        params: params,
      })
      .then(function(response) {
        return response.data.data;
      });
  };

  /**
   * Build params as per API filtering, sorting and paging
   * @param  {Object} [params] reports filters
   * @return {Object}
   */
  Summary.prepareQuery = function(params) {
    //ensure params
    params = _.merge({}, params);

    //initialize query
    var query = {};

    /* jshint ignore:start */
    //1. ensure start and end dates
    //1.0 ensure start date
    params.startedAt = params.startedAt
      ? moment(new Date(params.startedAt))
          .utc()
          .startOf('date')
      : moment()
          .utc()
          .startOf('date');
    //1.1 ensure end date
    params.endedAt = params.endedAt
      ? moment(new Date(params.endedAt))
          .utc()
          .endOf('date')
      : moment()
          .utc()
          .endOf('date');
    /* jshint ignore:end */

    //1.2 ensure start is less than end
    var startedAt = params.startedAt;
    if (params.startedAt.isAfter(params.endedAt)) {
      params.startedAt = params.endedAt;
      params.endedAt = startedAt;
    }
    //1.3 build start & end date criteria
    query.createdAt = {
      $gte: params.startedAt.startOf('date').toDate(),
      $lte: params.endedAt.endOf('date').toDate(),
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

    //ensure service types
    //3. ensure service types
    //3.0 normalize & compact service types
    params.servicetypes = _.uniq(_.compact([].concat(params.servicetypes)));
    //3.1 build group criteria
    if (params.servicetypes.length >= 1) {
      if (params.servicetypes.length > 1) {
        //use $in criteria
        query.type = { $in: params.servicetypes };
      } else {
        //use $eq criteria
        query.type = _.first(params.servicetypes);
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

    //ensure workspaces
    //7. ensure workspaces
    //7.0 normalize & compact workspaces
    params.workspaces = _.uniq(_.compact([].concat(params.workspaces)));
    //7.1 build priority criteria
    if (params.workspaces.length >= 1) {
      // query.method = {};
      if (params.workspaces.length > 1) {
        //use $in criteria
        query['method.workspace'] = { $in: params.workspaces };
      } else {
        //use $eq criteria
        query['method.workspace'] = _.first(params.workspaces);
      }
    }

    //ensure methods
    //7. ensure methods
    //7.0 normalize & compact methods
    params.methods = _.uniq(_.compact([].concat(params.methods)));
    //7.1 build reporting method criteria
    if (params.methods.length >= 1) {
      // query.method = {};
      if (params.methods.length > 1) {
        //use $in criteria
        query['method.name'] = { $in: params.methods };
      } else {
        //use $eq criteria
        query['method.name'] = _.first(params.methods);
      }
    }

    return query;
  };

  return Summary;
});
