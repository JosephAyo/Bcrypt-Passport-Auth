var express = require('express');

const Profile = require('../models/Profile');

const mongoose = require('mongoose');
var url = 'mongodb://localhost/encrypt';



module.exports.usernameCheck = (username) => {
    //Find all documents in the customers collection:
    Profile.findOne({
        username: username
    }).then(result => {
        if (result) {
            return false;
        } else {
            console.log('not found');
            return true;
        }
    });
};

module.exports.dbUpload = (username, password) => {
    console.log(password + 'log from dbUpload');
    //Find all documents in the customers collection:
    Profile.create({
        username: username,
        password: password
    });
};