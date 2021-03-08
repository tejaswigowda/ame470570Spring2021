var Client = require('node-rest-client').Client;
var client = new Client();
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 1234;

var MS = require("mongoskin");
var db = MS.db("mongodb://34.219.163.158:27017/rssFeeds")
var rssList = [];

app.get("/", function (req, res) {
      res.redirect("/index.html");
});

app.get("/getFeedData", function (req, res) {
  var feed = req.query.feed;
  client.get(feed, function (data, response) {
    res.send(data);
  });
});

app.get("/getFeeds", function (req, res) {
  db.collection("data").find({}).toArray(function(e1,r1){
    res.send(JSON.stringify(r1));
  });
});

app.get("/deleteFeed", function (req, res) {
  var index = parseInt(req.query.feedno);
  rssList.splice(index, 1);
  res.send(JSON.stringify(rssList));
});


app.get("/editFeed", function (req, res) {
  var feedid = req.query.feedid;
  var newname  = req.query.newname;
  db.collection("data").findOne({id:feedid}, function(err,result){
    result.name = newname;
    db.collection("data").save(result, function(e,r){
      db.collection("data").find({}).toArray(function(e1,r1){
        res.send(JSON.stringify(r1));
      });
    });
  })
});

app.get("/addFeed", function (req, res) {
  var feed = req.query.feed;
  var name = req.query.name;
  var obj = {
    id: new Date().getTime().toString(),
    name: name,
    feed: feed,
    time: new Date().getTime()
  }
  db.collection("data").insert(obj, function(err,result){
    db.collection("data").find({}).toArray(function(e1,r1){
      res.send(JSON.stringify(r1));
    });
  });
});





app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
