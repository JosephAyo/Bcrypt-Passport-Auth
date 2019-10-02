var express = require('express');
var router = express.Router();
const Profile = require('../models/Profile');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const bodyParser = require('body-parser');



router.use(express.json());
router.use(express.urlencoded({
    extended: false
}));
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

const mongoose = require('mongoose');
var url = 'mongodb://localhost/encrypt';
const uri ='mongodb+srv://josephayo:mongodb360@cluster0-ys6nl.mongodb.net/test?retryWrites=true&w=majority';
/* GET users listing. */
router.get('/', passport.authenticate('jwt', {
    session: false
}), function (req, res, next) {
    Profile.find({})
        .then(function (results) {
            if(results.length>0){
                const response ={
                    users: results.map(
                        result=>{
                            return {
                                confirmation: 'success',
                                data: result,
                                request: {
                                    method: 'GET',
                                    url: `http://localhost:4040/user/${result._id}`
                                }
                            };                        
                        }
                    )
                };
                res.status(200).json(response);
            }else {
                res.status(404).json({
                    message: 'NO ENTRIES FOUND'
                });
            }
        })
        .catch(function (err) {
            res.json({
                confirmation: 'failed',
                message: (`this error occurred from get all: ${err.message}`)
            });
        });
});


router.patch('/current', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const id = req.user[0]._id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Profile.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/current/similar', passport.authenticate('jwt', {
    session: false
}), function (req, res, next) {
    Profile.find({
            interest: req.user[0].interest
        }).select("username email interest blogPost phoneNumber")
        .then(results => {
            res.json({
                sameInterestUsers: {
                    results
                }
            });
        })
        .catch(function (err) {
            res.json({
                confirmation: 'failed',
                message: (`this error occurred: ${err.message}`)
            });
        });
});

router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        confirmation: 'success',
        message: 'token was used to get here',
        Currentuser: req.user[0]
    });
});

router.get('/:userId', function (req, res, next) {
    const id = req.params.userId;
    Profile.findById(id)
        .select("username phoneNumber interest blogPost email")
        .then(function (result) {
            res.json({
                confirmation: 'success',
                data: result
            });
        })
        .catch(function (err) {
            res.json({
                confirmation: 'failed',
                message: (`this error occurred from get by id: ${err.message}`)
            });
        });
});

router.patch('/addComment',(req,res,next)=>{
    const id = req.body.id;
    const comment = req.body.comment;
    Profile.update({_id: id},{$push: {comments: comment }})
    .then(result=>{
        res.status(200).json({
            result: result
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;