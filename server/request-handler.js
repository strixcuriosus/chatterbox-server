/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var url = require("url");
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};
var storage = [];

var handleResponse = function(){

};
var requestHandler = function(request, response) {
  var statusCode = 200;
  // var headers = defaultCorsHeaders;
  console.log("path: " + url.parse(request.url).pathname);
  var path = url.parse(request.url).pathname;
  if((/^\/classes\//).test(path)){
    if (request.method === "OPTIONS"){
      response.writeHead(200, defaultCorsHeaders);
      response.end();
    } else if (request.method === 'GET') {
      response.writeHead(200, defaultCorsHeaders);
      response.end(JSON.stringify({results:storage}));
    } else if (request.method === 'POST') {
      var body = '';
      request.on('data', function(chunk){
        body += chunk;
      });
      request.on('end', function(){
        console.log("the body: ",body);
        storage.push(JSON.parse(body));
        response.writeHead(201, defaultCorsHeaders);
        response.end();
      });
    }
  } else {
    response.writeHead(404, defaultCorsHeaders);
    response.end();
  }

  console.log("Serving request type " + request.method + " for url " + request.url);

};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */

exports.handler = requestHandler;
