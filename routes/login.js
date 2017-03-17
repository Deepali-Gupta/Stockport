// "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase"
var db = require('../queries');
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');

/* GET users listing. */

var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.post('/', db.authenticate, function (req, res, next) {
    // console.log("-------------------login post method called------------------");
    // console.log("++++++++++++++++++++",req.body.username);
    // req.session.user = req.body.username;
    // console.log("--------------++++++++++++-------", req.session.authenticated);
    if (req.session.authenticated) {
        res.send({ authenticated: true });
        
    }
    else {
        res.send({ authenticated: false });
        
    }
});



module.exports = router;