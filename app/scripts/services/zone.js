'use strict';

/**
 * @ngdoc service
 * @name ng311.Zone
 * @description
 * # Zone
 * Factory in the ng311.
 */
angular.module('ng311').factory('Zone', function($http, $resource, Utils) {
  //create service resource
  var Zone = $resource(
    Utils.asLink(['v1/predefines/zones', ':id']),
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
  Zone.find = function(params) {
    return $http
      .get(Utils.asLink('v1/predefines/zones'), {
        params: params,
      })
      .then(function(response) {
        //map plain service object to resource instances
        var zones = response.data.data.map(function(service) {
          //create service as a resource instance
          return new Zone(service);
        });

        //return paginated response
        return {
          zones: zones,
          total: response.data.total,
        };
      });
  };

  return Zone;
});
