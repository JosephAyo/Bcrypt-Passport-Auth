const mongoose = require('mongoose');
var url = 'mongodb://localhost/authen';

mongoose.connect(url, {
    useNewUrlParser: true
});

//create new Schema named Profile
const Profile = new mongoose.Schema({
    username: {
        type: String,
        default: '',
        trim: true
    },
    email: {
        type: String,
        default: '',
        trim: true
    },
    phoneNumber: {
        type: Number,
        default: '',
        trim: true
    },
    password: {
        type: String,
        default: '',
        trim: true
    },
    interest:{
        type: String,
        default: '',
        trim: true
    },
    blogPost: {
        type: String,
        default: '',
        trim: true
    },
    comments:[]
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', Profile);