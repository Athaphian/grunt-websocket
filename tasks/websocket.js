/*
 * grunt-websocket
 * https://github.com/Athaphian/grunt-websocket
 *
 * Copyright (c) 2014 Bas Biesheuvel
 * Licensed under the MIT license.
 */

'use strict';

var http = require('http');

module.exports = function (grunt) {

  /**
   * Start a websocket server.
   */
  grunt.registerMultiTask('websocket', 'Starts a websocket server.', function () {

    // Read configuration
    var port = grunt.config.get('websocket.' + this.target + '.options.port') || grunt.config.get('websocket.options.port') || 8888;
    var useConnect = grunt.config.get('websocket.' + this.target + '.options.useConnect') || grunt.config.get('websocket.options.useConnect') || false;
    var handler = grunt.config.get('websocket.' + this.target + '.options.handler') || grunt.config.get('websocket.options.handler') || undefined;

    // Attaches a websocket server to the specified http server.
    var attachWebsocket = function (server) {

      // Retrieve the configured handler.
      if (handler) {
        handler = require(require('path').resolve() + '/' + handler);
      } else {
        console.log('No handler defined for websocket server, not starting websocket.');
        return;
      }

      // Attach websockets server to http server
      var WebSocketServer = require('websocket').server;
      var wsServer = new WebSocketServer({
        httpServer: server
      });

      // Handle requests
      wsServer.on('request', handler);
    };

    // If we should use a running connect, listen for the 'connect-started' event. If not, start a new http server on the specified port.
    if (useConnect) {
      console.log('Connecting websocket server to running connect...');

      grunt.event.on('connect-started', function (server, connectPort) {
        // Only attach to connect if the connect port matches the specified port
        if (connectPort === port) {
          attachWebsocket(server);
          console.log('Websocket server connected.');
        }
      });
    } else {
      console.log('Starting websocket server on port: ', port);

      var server = http.createServer(function (request, response) {
        // Standalone webserver here.. doing nothing.
      });

      server.listen(port, function () {
        console.log('Waiting...');
      });

      attachWebsocket(server);
    }
  });

};



