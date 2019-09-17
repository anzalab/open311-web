'use strict';

/**
 * @ngdoc service
 * @name ng311.Service
 * @description
 * # Service
 * Factory in the ng311.
 */
angular.module('ng311').factory('Service', function($http, $resource, Utils) {
  //create service resource
  var Service = $resource(
    Utils.asLink(['v1', 'services', ':id']),
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
   * @description find service with pagination
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Service.find = function(params) {
    //ensure service group is populated
    params = _.merge({}, params, {
      populate: [{ path: 'group', select: 'name' }],
    });

    return $http
      .get(Utils.asLink(['v1', 'services']), {
        params: params,
      })
      .then(function(response) {
        //map plain service object to resource instances
        var services = response.data.data.map(function(service) {
          //create service as a resource instance
          return new Service(service);
        });

        //return paginated response
        return {
          services: services,
          total: response.data.total,
        };
      });
  };

  return Service;
});
