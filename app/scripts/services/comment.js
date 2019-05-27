'use strict';

/**
 * @ngdoc service
 * @name ng311.Comment
 * @description
 * # Comment
 * Factory in the ng311.
 */
angular.module('ng311').factory('Comment', function($http, $resource, Utils) {
  //create comment resource
  var Comment = $resource(
    Utils.asLink(['comments', ':id']),
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
   * @description find comment with pagination
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Comment.find = function(params) {
    return $http
      .get(Utils.asLink('comments'), {
        params: params,
      })
      .then(function(response) {
        //map plain comment object to resource instances
        var comments = response.data.comments.map(function(comment) {
          //create comment as a resource instance
          return new Comment(comment);
        });

        //return paginated response
        return {
          comments: comments,
          total: response.data.count,
        };
      });
  };

  return Comment;
});
