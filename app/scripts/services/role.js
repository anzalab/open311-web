'use strict';

/**
 * @ngdoc service
 * @name ng311.Role
 * @description
 * # Role
 * Factory in ng311
 */
angular.module('ng311').factory('Role', function($http, $resource, Utils) {
  //create role resource
  var Role = $resource(
    Utils.asLink(['roles', ':id']),
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
   * @description find roles with pagination
   * @param  {Object} params [description]
   */
  Role.find = function(params) {
    return $http
      .get(Utils.asLink('roles'), {
        params: params,
      })
      .then(function(response) {
        //map plain role object to resource instances
        var roles = response.data.roles.map(function(role) {
          //create role as a resource instance
          return new Role(role);
        });

        //return paginated response
        return {
          roles: roles,
          total: response.data.count,
        };
      });
  };

  return Role;
});
