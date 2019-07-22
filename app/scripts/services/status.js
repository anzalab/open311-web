'use strict';

/**
 * @ngdoc service
 * @name ng311.Status
 * @description
 * # Status
 * Factory in the ng311.
 */
angular.module('ng311').factory('Status', function($http, $resource, Utils) {
  //create status resource
  var Status = $resource(
    Utils.asLink(['v1', 'statuses', ':id']),
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
   * @description find status with pagination
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Status.find = function(params) {
    return $http
      .get(Utils.asLink(['v1', 'statuses']), {
        params: params,
      })
      .then(function(response) {
        //map plain status object to resource instances
        var statuses = response.data.data.map(function(status) {
          //create status as a resource instance
          return new Status(status);
        });

        //return paginated response
        return {
          statuses: statuses,
          total: response.data.count,
        };
      });
  };

  return Status;
});
