const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const keys = require('../config/keys');
const localStorage = require('localStorage');
const myValue = localStorage.getItem('token');
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

passport.use('jwt',
    new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(ExtractJwt.fromAuthHeaderAsBearerToken());
        Profile.find({username:jwt_payload.username})
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
    })
);