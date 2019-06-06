'use strict';

/**
 * @ngdoc service
 * @name ng311.Setting
 * @description
 * # Setting
 * Factory in ng311
 */
angular.module('ng311').factory('Setting', function($http, $resource, Utils) {
  //create setting resource
  var Setting = $resource(
    Utils.asLink(['settings', ':id']),
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
   * @description find settings with pagination
   * @param  {Object} params [description]
   */
  Setting.find = function(params) {
    return $http
      .get(Utils.asLink('settings'), {
        params: params,
      })
      .then(function(response) {
        //map plain setting object to resource instances
        var settings = response.data.settings.map(function(setting) {
          //create setting as a resource instance
          return new Setting(setting);
        });

        //return paginated response
        return {
          settings: settings,
          total: response.data.count,
        };
      });
  };

  /**
   * @description bulk update applications settings
   * @param  {Object} data [description]
   */
  Setting.bulkUpdate = function(data) {
    var fakeId = new Date().getTime().toString();
    data = angular.toJson(data);

    return $http.put(Utils.asLink(['settings', fakeId]), data);
  };

  return Setting;
});
