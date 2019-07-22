'use strict';

/**
 * @ngdoc service
 * @name ng311.Item
 * @description
 * # Item
 * Factory in the ng311.
 */
angular.module('ng311').factory('Item', function($http, $resource, Utils) {
  //create service resource
  var Item = $resource(
    Utils.asLink(['v1/predefines/items', ':id']),
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
  Item.find = function(params) {
    return $http
      .get(Utils.asLink('v1/predefines/items'), {
        params: params,
      })
      .then(function(response) {
        //map plain service object to resource instances
        var items = response.data.data.map(function(service) {
          //create service as a resource instance
          return new Item(service);
        });

        //return paginated response
        return {
          items: items,
          total: response.data.total,
        };
      });
  };

  return Item;
});
