var pgp = require('pg-promise')(/*options*/);
var connectionString = 'postgres://postgres:admin@localhost:5432/puppies';
// "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase"
var db = pgp(connectionString);
var express = require('express');
var router = express.Router();
var path = require('path');

/* GET users listing. */

var users = {
    tj: {
        username: 'tj',
        password: 'pass'
    }
};

// create table user (
// 	userid serial PRIMARY KEY,
// 	username varchar not null,
// 	password, varchar not null,
// 	email varchar,
// 	create_date date YYYY-MM-DD
// );


// function checkUsername(req, res, next) {
//     var username = req.params.username;
//     db.one('select * from user where username = $1', username).then(function (data) {
//         res.status(200)
//             .json({
//                 status: 'success',
//                 data: data,
//                 message: 'Retrieved a user'
//             });
//     }).catch(function (err) {
//         res.status(200)
//             .json({
//                 status: 'failure',
//                 data: data,
//                 message: 'User Doesn\'t exist'
//             });
//         return next(err);
//     });
// }



function authenticate(username, pass, fn) {
    console.log('authenticating %s:%s', username, pass);
    var user = users[username];
    // query the db for the given username
    if (!user) return fn(new Error('cannot find user'));
    if (pass == user.password) return fn(null, user);
    return fn(new Error('invalid password'));

}

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/');
    }
}

router.post('/', function (req, res,next) {
    authenticate(req.body.userName, req.body.password,
        function (err, user) {
            console.log('called');
            if (user) {
                // Regenerate session when signing in
                // to prevent fixation
                req.session.regenerate(function () {
                    // Store the user's primary key
                    // in the session store to be retrieved,
                    // or in this case the entire user object
                    req.session.user = user;
                    req.session.success = 'Authenticated as ' + user.name
                        + ' click to <a href="/logout">logout</a>. '
                        + ' You may now access <a href="/restricted">/restricted</a>.';
                    console.log(req.session.success);
                    res.redirect('back');

                });
            } else {
                req.session.error = 'Authentication failed, please check your '
                    + ' username and password.'
                    + ' (use "tj" and "pass")';
                res.redirect('/');
            }
        });
});

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});




module.exports = router;