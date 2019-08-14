'use strict';

/**
 * @ngdoc service
 * @name ng311.Priority
 * @description
 * # Priority
 * Factory in the ng311.
 */
angular.module('ng311').factory('Priority', function($http, $resource, Utils) {
  //create priority resource
  var Priority = $resource(
    Utils.asLink(['v1', 'priorities', ':id']),
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
   * @description find priority with pagination
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Priority.find = function(params) {
    return $http
      .get(Utils.asLink(['v1', 'priorities']), {
        params: params,
      })
      .then(function(response) {
        //map plain priority object to resource instances
        var priorities = response.data.data.map(function(priority) {
          //create priority as a resource instance
          return new Priority(priority);
        });

        //return paginated response
        return {
          priorities: priorities,
          total: response.data.total,
        };
      });
  };

  return Priority;
});
