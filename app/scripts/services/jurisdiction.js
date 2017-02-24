'use strict';

/**
 * @ngdoc service
 * @name ng311.Jurisdiction
 * @description
 * # Jurisdiction
 * Factory in the ng311.
 */
angular
  .module('ng311')
  .factory('Jurisdiction', function ($http, $resource, Utils) {

    //create jurisdiction resource
    var Jurisdiction = $resource(Utils.asLink(['jurisdictions', ':id']), {
      id: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
    });


    /**
     * @description find jurisdiction with pagination
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    Jurisdiction.find = function (params) {
      return $http.get(Utils.asLink('jurisdictions'), {
          params: params
        })
        .then(function (response) {

          //map plain jurisdiction object to resource instances
          var jurisdictions =
            response.data.jurisdictions.map(function (jurisdiction) {
              //create jurisdiction as a resource instance
              return new Jurisdiction(jurisdiction);
            });

          //return paginated response
          return {
            jurisdictions: jurisdictions,
            total: response.data.count
          };
        });
    };

    return Jurisdiction;
  });
