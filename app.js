var express = require('express');
var app = express();
var path = require('path');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const jwt = require('jsonwebtoken');
var indexRouter = require('./routes/index');
var user = require('./routes/user');
var url = 'mongodb://localhost/authen';
const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const keys = require('./config/keys');
const localStorage = require('localStorage');


mongoose.connect(url, {
    useMongoClient: true
});

mongoose.Promise = global.Promise;

// set routes
app.use('/user', user);

require('./config/passport');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());


app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(200).json({});
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(passport.initialize());


app.post('/signup', (req, res, next) => {
    var username = req.body.username;
    var email = req.body.email;
    var phoneNumber = req.body.phoneNumber;
    var PlaintextPassword = req.body.password;
    console.log(req.body);
    Profile.findOne({
        username: username
    }).then(result => {
        if (result) {
            res.status(401).end('Username already in use!');
        } else {
            console.log('not found');
            bcrypt.hash(PlaintextPassword, saltRounds, function (err, hash) {
                Profile.create({
                        username: username,
                        email: email,
                        phoneNumber: phoneNumber,
                        password: hash
                    })
                    .then(result => {
                        res.status(200).json({
                            message: 'NEW USER CREATED',
                            user: {
                                username: username,
                                email: email,
                                phoneNumber: phoneNumber,
                                password: hash
                            }
                        });
                    });
            });
        }
    });
});

app.get("/login_page", (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public') + '/login.html', {
        title: 'Login Page'
    });
});


//TO DO: CHANGE TO JWT AUTHENTICATION
app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(`from post:'/login' ${username}`);
    Profile.find({
        username: username
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            console.log('unknown user');
            return done(null, false, {
                message: 'Unknown User'
            });
        } else {
            console.log(`passport saw this ==========> ${user[0].password}`);
        }
        bcrypt.compare(password, user[0].password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                console.log(`SUCCESS ${user[0].username} successfully logged in`);
                console.log(`user[0]._id: ${user[0]._id}`);
                var payload = {
                    email: user[0].email,
                    username: user[0].username
                };
                const token = jwt.sign(payload,
                    keys.secretOrKey, {
                        expiresIn: "1h"
                    });
                res.json({
                    confirmation: 'success',
                    response: token,
                    user: user[0].username
                });
            } else {
                console.log('not confirmed');
                res.status(401).end('Invalid username or password!!!');
            }
        });
    });
});

//handle errors that go uncaught in the routes
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

const port = process.env.PORT || 4040;


app.listen(port, () => {
    console.log(`app is listening on port: ${port}`);
});

module.exports = app;