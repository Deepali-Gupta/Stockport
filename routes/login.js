var pgp = require('pg-promise')(/*options*/);
var connectionString = 'postgres://postgres:admin@localhost:5432/puppies';
// "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase"
var db = pgp(connectionString);
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');

/* GET users listing. */

var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');


var users = {
    username: 'tj',
    password: 'pass'
};

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.post('/', function(req, res, next) {
    console.log("-------------------here2------------------");
    console.log("++++++++++++++++++++",req.body.username);
    req.session.user = req.body.username;
    console.log("--------------++++++++++++-------" , req.session.user);
    next();
    // res.redirect('/');
});




function checkSignIn(req, res){
    if(req.session.user){
        console.log("--------------logged in-------------------");
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.user);
        next(err);  //Error, trying to access unauthorized page!
    }
}



// router.post('/login', function(req, res){
//     console.log(Users);
//     if(!req.body.id || !req.body.password){
//         res.render('login', {message: "Please enter both id and password"});
//     }
//     else{
//         Users.filter(function(user){
//             if(user.id === req.body.id && user.password === req.body.password){
//                 req.session.user = user;
//                 res.redirect('/protected_page');
//             }
//         });
//         res.render('login', {message: "Invalid credentials!"});
//     }
// });

// router.get('/logout', function(req, res){
//     req.session.destroy(function(){
//         console.log("user logged out.")
//     });
//     res.redirect('/login');
// });




// // create table user (
// // 	userid serial PRIMARY KEY,
// // 	username varchar not null,
// // 	password, varchar not null,
// // 	email varchar,
// // 	create_date date YYYY-MM-DD
// // );


// // function checkUsername(req, res, next) {
// //     var username = req.params.username;
// //     db.one('select * from user where username = $1', username).then(function (data) {
// //         res.status(200)
// //             .json({
// //                 status: 'success',
// //                 data: data,
// //                 message: 'Retrieved a user'
// //             });
// //     }).catch(function (err) {
// //         res.status(200)
// //             .json({
// //                 status: 'failure',
// //                 data: data,
// //                 message: 'User Doesn\'t exist'
// //             });
// //         return next(err);
// //     });
// // }

module.exports = router;