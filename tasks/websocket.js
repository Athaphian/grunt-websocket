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

    // Read port configuration
    var port = grunt.config.get('websocket.' + this.target + '.options.port') || grunt.config.get('websocket.options.port') || 8888;
    var handler = grunt.config.get('websocket.' + this.target + '.options.handler') || grunt.config.get('websocket.options.handler') || undefined;

    if (handler) {
      handler = require('../../../' + handler);
    }

    console.log('Starting websocket server on port: ', port);

    var WebSocketServer = require('websocket').server;

    var server = http.createServer(function (request, response) {
      // Webserver here, TODO: find a way to link to running connect server
    });

    server.listen(port, function () {
      console.log('Waiting...');
    });

    // Attach websockets server to http server
    var wsServer = new WebSocketServer({
      httpServer: server
    });

    // Handle requests
    wsServer.on('request', handler);
  });

};



