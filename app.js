/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var bodyParser = require('body-parser');
var jade = require('jade');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('jay:CorrectHorseBatteryStaple@aws-us-east-1-portal.11.dblayer.com:27607/connect-more');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.get('/leaderboard', function(req, res) {
    var db = req.db;
    var collection = db.get('scores');
    collection.find({},{sort: {score: 1}},function(e,scores) {
        res.render('leaderboard', {
            'leaderboard': scores
        });
    })
});
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.post('/postScore', function(req, res) {
    var db = req.db;
    var collection = db.get('scores');
    var name = req.body.username;
    var score = parseInt(req.body.score);
    collection.insert({
        'name': name,
        'score': score
    }, function(err, doc) {
        if (err) {
            res.send("error!");
        } else {
            res.redirect("leaderboard");
        }
    })
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});