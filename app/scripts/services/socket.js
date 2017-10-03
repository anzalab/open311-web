'use strict';

/**
 * @ngdoc service
 * @name ng311.socket
 * @description
 * # socket
 * Factory in the ng311.
 */
angular
  .module('ng311')
  .factory('socket', function (ENV, Utils, socketFactory) {

    //no op socket
    var socket = {};

    if (ENV && ENV.socketEnable) {
      //socket endpoint
      var socketEndPoint = (ENV.socketEndPoint || {}.web) || Utils.asLink('');

      //initialize socket.io
      socket = socketFactory({
        ioSocket: io(socketEndPoint)
      });
    }

    return socket;

  });
