'use strict';

/**
 * @ngdoc service
 * @name ng311.QualityAdvisory
 * @description
 * # QualityAdvisory
 * Factory in the ng311.
 */
angular
  .module('ng311')
  .factory('QualityAdvisory', function($http, $resource, Utils) {
    //create qualityadvisory resource
    var QualityAdvisory = $resource(
      Utils.asLink(['v1/predefines/qualityadvisories', ':id']),
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
     * @description find qualityadvisory with pagination
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    QualityAdvisory.find = function(params) {
      return $http
        .get(Utils.asLink('v1/predefines/qualityadvisories'), {
          params: params,
        })
        .then(function(response) {
          //map plain qualityadvisory object to resource instances
          var qualityadvisories = response.data.data.map(function(
            qualityadvisory
          ) {
            //create qualityadvisory as a resource instance
            return new QualityAdvisory(qualityadvisory);
          });

          //return paginated response
          return {
            qualityadvisories: qualityadvisories,
            total: response.data.total,
          };
        });
    };

    return QualityAdvisory;
  });
