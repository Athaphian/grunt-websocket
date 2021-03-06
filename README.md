grunt-websocket
===============

Grunt wrapper for websocket.

Wraps the [websocket](https://www.npmjs.org/package/websocket) implementation for nodejs in a very basic grunt plugin.

Configuration in grunt file:

```js
grunt.initConfig({
    websocket: {
          options: {
            port: 1337,
            handler: 'websockets/websocketHandler.js'
          },
          target: {}
        }
})
```

### Options
The available configuration options.

#### options.port or target.options.port
Type: `Number`
Default: 8888

The port number on which to start the websockets server.

#### options.handler or target.options.handler
Type: `String`

The relative location of a handler script. The handler script defines a simple function that takes a request object as parameter.
The request object is the actual request object from the websockets library.

#### options.useConnect or target.options.useConnect
Type: `Boolean`

Specifies whether to attach to a existing connect webserver or to start a standalone http server to serve websockets. When set to true,
the websocket task must be executed before starting connect so that websocket can start when connect emits the started event. Also
the configured port should match the connect port, this can be used to connect specific websocket servers to specific connect instances.

NOTE: Currently setting this to true does not work, I am in the progress of sending a pull request to grunt-connect to support this event...
Make this work locally by editint grunt-contrib-connect/tasks/connect.js and after the keepalive check add this snippet:

```js
grunt.event.emit('connect-started', server, options.port);
```

### Server example (handler)

Handler example that receives a JSON object from the client and echoes it back with a delay of 2 seconds.

```js
module.exports = function (request) {
  var connection = request.accept(null, request.origin);

  console.log('client connected: ', request.origin);

  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      var object = JSON.parse(message.utf8Data);

      console.log('received:', object);

      setTimeout(function () {
        connection.sendUTF(JSON.stringify(object));
      }, 2000);
    }
  });

  connection.on('close', function (connection) {
    console.log('connection closed');
  });
};
```

### Client example

Client example that sends a JSON object to the handler on the server.

```js
// if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  var connection = new WebSocket('ws://127.0.0.1:1337');

  connection.onopen = function () {
    console.log('Connection ready');

    connection.send(JSON.stringify({name: 'John Doe'}));
  };

  connection.onerror = function (error) {
    console.log('error', error);
  };

  connection.onmessage = function (message) {
    try {
      var json = JSON.parse(message.data);
      console.log(json);
    } catch (e) {
      console.log('This doesn\'t look like a valid JSON: ', message.data);
    }
  };
```