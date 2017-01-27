'use strict';

/**
 * @ngdoc service
 * @name ng311.ServiceRequest
 * @description
 * # ServiceRequest
 * Factory in the ng311.
 */
angular
  .module('ng311')
  .factory('ServiceRequest', function ($http, $resource, Utils) {

    //create servicerequest resource
    var ServiceRequest = $resource(Utils.asLink(['servicerequests', ':id']), {
      id: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
    });


    /**
     * @description find servicerequest with pagination
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    ServiceRequest.find = function (params) {
      return $http.get(Utils.asLink('servicerequests'), {
          params: params
        })
        .then(function (response) {

          //map plain servicerequest object to resource instances
          var servicerequests = response.data.servicerequests.map(
            function (servicerequest) {
              //create servicerequest as a resource instance
              return new ServiceRequest(servicerequest);
            });

          //return paginated response
          return {
            servicerequests: servicerequests,
            total: response.data.count
          };
        });
    };

    return ServiceRequest;
  });
