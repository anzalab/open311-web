'use strict';

/**
 * @ngdoc service
 * @name ng311.ServiceGroup
 * @description
 * # ServiceGroup
 * Factory in the ng311.
 */
angular
  .module('ng311')
  .factory('ServiceGroup', function($http, $resource, Utils) {
    //create servicegroup resource
    var ServiceGroup = $resource(
      Utils.asLink(['servicegroups', ':id']),
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
     * @description find servicegroup with pagination
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    ServiceGroup.find = function(params) {
      return $http
        .get(Utils.asLink('servicegroups'), {
          params: params,
        })
        .then(function(response) {
          //map plain servicegroup object to resource instances
          var servicegroups = response.data.servicegroups.map(function(
            servicegroup
          ) {
            //create servicegroup as a resource instance
            return new ServiceGroup(servicegroup);
          });

          //return paginated response
          return {
            servicegroups: servicegroups,
            total: response.data.count,
          };
        });
    };

    return ServiceGroup;
  });
