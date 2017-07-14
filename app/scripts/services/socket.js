'use strict';

/**
 * @ngdoc service
 * @name ng311.socket
 * @description
 * # socket
 * Factory in the ng311.
 */
angular.module('ng311')
  .factory('socket', function ( /*ENV,*/ socketFactory) {

    //TODO check for socket.io integration
    //from configuration

    //initialize socket.io
    var socket = socketFactory({
      ioSocket: io('http://localhost:9090')
    });

    return socket;

  });
