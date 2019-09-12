'use strict';

/**
 * @ngdoc Message
 * @name ng311.Message
 */
angular.module('ng311').factory('Message', function($resource, $http, Utils) {
  //create message resource
  var Message = $resource(
    Utils.asLink(['messages']),
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
   * Find messages with pagination
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
  Message.find = function(params) {
    return $http
      .get(Utils.asLink(['v1', 'messages']), { params: params })
      .then(function(response) {
        var messages = response.data.data.map(function(message) {
          return new Message(message);
        });

        return {
          messages: messages,
          total: response.data.total,
        };
      });
  };

  return Message;
});
