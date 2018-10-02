'use strict';

/**
 * @ngdoc Alert
 * @name ng311.Alert
 */
angular
  .module('ng311')
  .factory('Alert', function ($resource, $http, Utils) {
    // account accessors resource

    var Alert = $resource(Utils.asLink(['v1', 'alerts']),
      {
        id: '@_id',
      }, {
        update: {
          method: 'PUT'
        }
      }
    );


    /**
     * Find alerts with pagination
     *
     * @function
     * @name find
     *
     * @param {Object} params
     * @returns {Object}
     *
     * @version 0.1.0
     * @since 0.1.0
     */
    Alert.find = function (params) {
      return $http
        .get(Utils.asLink(['v1', 'alerts']), { params: params })
        .then(function (response) {

          var alerts = response.data.data.map(function (alert) {

            return new Alert(alert);
          });

          return {
            alerts: alerts,
            total: response.data.total
          };
        });
    };

    return Alert;
  });
