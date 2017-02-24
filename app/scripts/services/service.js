'use strict';

/**
 * @ngdoc service
 * @name ng311.Service
 * @description
 * # Service
 * Factory in the ng311.
 */
angular
  .module('ng311')
  .factory('Service', function ($http, $resource, Utils) {

    //create service resource
    var Service = $resource(Utils.asLink(['services', ':id']), {
      id: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
    });


    /**
     * @description find service with pagination
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    Service.find = function (params) {
      return $http.get(Utils.asLink('services'), {
          params: params
        })
        .then(function (response) {

          //map plain service object to resource instances
          var services = response.data.services.map(function (service) {
            //create service as a resource instance
            return new Service(service);
          });

          //return paginated response
          return {
            services: services,
            total: response.data.count
          };
        });
    };

    return Service;
  });
