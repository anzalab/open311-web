'use strict';

/**
 * @ngdoc service
 * @name ng311.ServiceType
 * @description
 * # ServiceType
 * Factory in the ng311.
 */
angular
  .module('ng311')
  .factory('ServiceType', function($http, $resource, Utils) {
    //create service type resource
    var ServiceType = $resource(
      Utils.asLink(['v1/predefines/servicetypes', ':id']),
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
     * @description find service type with pagination
     * @param  {Object} params query params
     * @return {Object}
     */
    ServiceType.find = function(params) {
      return $http
        .get(Utils.asLink('v1/predefines/servicetypes'), {
          params: params,
        })
        .then(function(response) {
          //map plain service object to resource instances
          var servicetypes = response.data.data.map(function(servicetype) {
            //create service type as a resource instance
            return new ServiceType(servicetype);
          });

          //return paginated response
          return {
            servicetypes: servicetypes,
            total: response.data.total,
          };
        });
    };

    return ServiceType;
  });
