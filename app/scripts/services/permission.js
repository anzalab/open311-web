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
  .factory('Permission', function ($http, $resource, Utils) {

    //create role resource
    var Permission = $resource(Utils.asLink(['permissions', ':id']), {
      id: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
    });


    /**
     * @description find permissions with pagination
     * @param  {Object} params [description]
     */
    Permission.find = function (params) {
      return $http.get(Utils.asLink('permissions'), {
          params: params
        })
        .then(function (response) {

          //map plain role object to resource instances
          var permissions = response.data.permissions.map(function (role) {
            //create role as a resource instance
            return new Permission(role);
          });

          //return paginated response
          return {
            permissions: permissions,
            total: response.data.count
          };
        });
    };

    return Permission;
  });
