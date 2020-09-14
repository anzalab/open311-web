'use strict';

/**
 * @ngdoc service
 * @name ng311.QualityCause
 * @description
 * # QualityCause
 * Factory in the ng311.
 */
angular
  .module('ng311')
  .factory('QualityCause', function($http, $resource, Utils) {
    //create qualitycause resource
    var QualityCause = $resource(
      Utils.asLink(['v1/predefines/qualitycauses', ':id']),
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
     * @description find qualitycause with pagination
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    QualityCause.find = function(params) {
      return $http
        .get(Utils.asLink('v1/predefines/qualitycauses'), {
          params: params,
        })
        .then(function(response) {
          //map plain qualitycause object to resource instances
          var qualitycauses = response.data.data.map(function(qualitycause) {
            //create qualitycause as a resource instance
            return new QualityCause(qualitycause);
          });

          //return paginated response
          return {
            qualitycauses: qualitycauses,
            total: response.data.total,
          };
        });
    };

    return QualityCause;
  });
