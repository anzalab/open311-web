'use strict';

/**
 * @ngdoc service
 * @name ng311.Permission
 * @description
 * # Permission
 * Factory in ng311
 */
angular
  .module('ng311')
  .factory('Permission', function($http, $resource, Utils) {
    //create permission resource
    var Permission = $resource(
      Utils.asLink(['permissions', ':id']),
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
     * @description find permissions with pagination
     * @param  {Object} params [description]
     */
    Permission.find = function(params) {
      return $http
        .get(Utils.asLink('permissions'), {
          params: params,
        })
        .then(function(response) {
          //map plain permission object to resource instances
          var permissions = response.data.permissions.map(function(permission) {
            //create permission as a resource instance
            return new Permission(permission);
          });

          //return paginated response
          return {
            permissions: permissions,
            total: response.data.count,
          };
        });
    };

    return Permission;
  });
