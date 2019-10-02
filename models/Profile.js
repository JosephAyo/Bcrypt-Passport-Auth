const mongoose = require('mongoose');
var url = 'mongodb://localhost/authen';
const uri ='mongodb+srv://josephayo:mongodb360@cluster0-ys6nl.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(uri);

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