grunt-websocket
===============

Grunt wrapper for websocket.

Wraps the [websocket](https://www.npmjs.org/package/websocket) implementation for nodejs in a very basic grunt plugin.

Configuration in grunt file:

```javascript
grunt.initConfig({
    websocket: {
          options: {
            port: 1337,
            handler: 'websockets/websocketHandler.js'

          },
          target: {}
        }
})
```javascript

Handler example:

```javascript
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
```javascript

Client example:

```javascript
// if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  var connection = new WebSocket('ws://127.0.0.1:1337');

  connection.onopen = function () {
    console.log('Connection ready');

    connection.send(JSON.stringify({name: 'bas'}));
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
```javascript