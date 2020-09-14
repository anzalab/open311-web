'use strict';

/**
 * @ngdoc service
 * @name ng311.QualityMeasure
 * @description
 * # QualityMeasure
 * Factory in the ng311.
 */
angular
  .module('ng311')
  .factory('QualityMeasure', function($http, $resource, Utils) {
    //create qualitymeasure resource
    var QualityMeasure = $resource(
      Utils.asLink(['v1/predefines/qualitymeasures', ':id']),
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
     * @description find qualitymeasure with pagination
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    QualityMeasure.find = function(params) {
      return $http
        .get(Utils.asLink('v1/predefines/qualitymeasures'), {
          params: params,
        })
        .then(function(response) {
          //map plain qualitymeasure object to resource instances
          var qualitymeasures = response.data.data.map(function(
            qualitymeasure
          ) {
            //create qualitymeasure as a resource instance
            return new QualityMeasure(qualitymeasure);
          });

          //return paginated response
          return {
            qualitymeasures: qualitymeasures,
            total: response.data.total,
          };
        });
    };

    return QualityMeasure;
  });
