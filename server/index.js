var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var Sync = require('sync');
	
var app = express();
var http = require('http').Server(app);
var port = 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());



http.listen(port, function () {
  console.log("server is running now at http://localhost:"+port);
})