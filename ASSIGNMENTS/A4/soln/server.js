var express = require("express");
var server = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 1234;

server.get("/add", function (req, res) {
    var a = parseFloat(req.query.a);
    var b = parseFloat(req.query.b);
    res.send((a+b).toString()); // send response body
});

server.get("/sub", function (req, res) {
    var a = parseFloat(req.query.a);
    var b = parseFloat(req.query.b);
    res.send((a-b).toString()); // send response body
});

server.get("/mul", function (req, res) {
    var a = parseFloat(req.query.a);
    var b = parseFloat(req.query.b);
    res.send((a*b).toString()); // send response body
});

server.get("/div", function (req, res) {
    var a = parseFloat(req.query.a);
    var b = parseFloat(req.query.b);
    res.send((a/b).toString()); // send response body
});


server.use(methodOverride());
server.use(bodyParser());
server.use(express.static(__dirname + '/public'));
server.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
server.listen(port);
