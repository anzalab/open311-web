'use strict';

/**
 * @ngdoc service
 * @name ng311.Party
 * @description
 * # Party
 * Factory in the ng311.
 */
angular.module('ng311').factory('Party', function($http, $resource, Utils) {
  //create party resource
  var Party = $resource(
    Utils.asLink(['parties', ':id']),
    {
      id: '@_id',
    },
    {
      update: {
        method: 'PUT',
      },
    }
  );

  /**
   * @description find party with pagination
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Party.find = function(params) {
    //ensure roles is populated
    params = _.merge({}, params, {
      populate: [{ path: 'roles' }],
    });

    return $http
      .get(Utils.asLink('parties'), {
        params: params,
      })
      .then(function(response) {
        //map plain party object to resource instances
        var parties = response.data.parties.map(function(party) {
          //create party as a resource instance
          return new Party(party);
        });

        //return paginated response
        return {
          parties: parties,
          total: response.data.count,
        };
      });
  };

  /**
   * @description request party password recover from backend
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Party.requestRecover = function(params) {
    return $http.put(Utils.asLink('forgot'), params).then(function(response) {
      return response.data;
    });
  };

  /**
   * @description send party password recovery to backend
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Party.recover = function(params) {
    return $http.put(Utils.asLink('recover'), params).then(function(response) {
      return response.data;
    });
  };

  /**
   * @description confirm party account
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Party.confirm = function(params) {
    return $http.put(Utils.asLink('confirm'), params).then(function(response) {
      return response.data;
    });
  };

  /**
   * @description change party password
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Party.change = function(params) {
    return $http.put(Utils.asLink('change'), params).then(function(response) {
      return response.data;
    });
  };

  /**
   * @description unlock given locked party account
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Party.unlock = function(params) {
    return $http.put(Utils.asLink('unlock'), params).then(function(response) {
      return response.data;
    });
  };

  /**
   * @description Obtain given party performances reports
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Party.performances = function(params) {
    var _id = params._id;
    params = _.omit(params, '_id');

    return $http
      .get(Utils.asLink(['parties', _id, 'performances']), {
        params: params,
      })
      .then(function(response) {
        return response.data;
      });
  };

  return Party;
});
