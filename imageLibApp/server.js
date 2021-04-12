var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./credentials.json');
var s3 = new AWS.S3();
const multer = require('multer')

var Client = require('node-rest-client').Client;
var client = new Client();
var url = require("url"),
	querystring = require("querystring");
var passport = require('passport');
var fs = require('fs');
	//var dbURL = 'mongodb://127.0.0.1:27017/rssReader';
	var dbURL = 'mongodb://34.219.163.158:27017/rssReader';
var path = require('path'),
  express = require('express'),
  db = require('mongoskin').db(dbURL);


var mongoose = require('mongoose');
mongoose.connect(dbURL); // connect to our database

var app = express();
var secret = 'test' + new Date().getTime().toString()

var session = require('express-session');
app.use(require("cookie-parser")(secret));
var MongoStore = require('connect-mongo')(session);
app.use(session( {store: new MongoStore({
   url: dbURL,
   secret: secret
})}));
app.use(passport.initialize());
app.use(passport.session());
var flash = require('express-flash');
app.use( flash() );

var bodyParser = require("body-parser");
var methodOverride = require("method-override");

app.use(methodOverride());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// parse application/json
app.use(bodyParser.json())

require('./passport/config/passport')(passport); // pass passport for configuration
require('./passport/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


app.get("/addProject", isLoggedIn, function(req,res){

})

app.get("/getProjects", function(req,res){

})

app.get("/getFeedData", function (req, res) {
  var feed = req.query.feed;
  client.get(feed, function (data, response) {
    res.send(data);
  });
});

app.get("/getFeeds", function (req, res) {
  var userid = req.query.userid;
  db.collection("data").find({userid:userid}).toArray(function(e1,r1){
    res.send(JSON.stringify(r1));
  });
});

app.get("/deleteFeed", function (req, res) {
  var feedid = req.query.feedid;
  var userid = req.query.userid;
  db.collection("data").remove({id:feedid, userid:userid}, function(err,result){
      db.collection("data").find({userid:userid}).toArray(function(e1,r1){
        res.send(JSON.stringify(r1));
      });
  });
});


app.get("/editFeed", function (req, res) {
  var feedid = req.query.feedid;
  var newname  = req.query.newname;
  var userid = req.query.userid;
  db.collection("data").findOne({id:feedid}, function(err,result){
    result.name = newname;
    db.collection("data").save(result, function(e,r){
      db.collection("data").find({userid:userid}).toArray(function(e1,r1){
        res.send(JSON.stringify(r1));
      });
    });
  })
});

app.get("/addFeed", function (req, res) {
  var feed = req.query.feed;
  var name = req.query.name;
  var userid = req.query.userid;
  var obj = {
    id: new Date().getTime().toString(),
    name: name,
    feed: feed,
    userid:userid,
    time: new Date().getTime()
  }
  db.collection("data").insert(obj, function(err,result){
    db.collection("data").find({userid:userid}).toArray(function(e1,r1){
      res.send(JSON.stringify(r1));
    });
  });
});


app.post('/uploadImage', function(req, res){
    var intname = req.body.fileInput;
    console.log(intname);
    var s3Path = '/' + intname;
    var buf = new Buffer(req.body.data.replace(/^data:image\/\w+;base64,/, ""),'base64');
    console.log(intname);
    var params = {
        Bucket:'bucket470570',
        ACL:'public-read',
        Key:intname,
        Body: buf,
        ServerSideEncryption : 'AES256'
    };
    s3.putObject(params, function(err, data) {
        console.log(err);
        res.end("success");
    });
});


app.use(express.static(path.join(__dirname, 'public')));
//app.listen(8080);
// DO NOT DO app.listen() unless we're testing this directly
if (require.main === module) { app.listen(8080); }
// Instead do export the app:
else{ module.exports = app; }

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send('noauth');
}


console.log("go to http://localhost:8080")
