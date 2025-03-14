const mongoose = require('mongoose');
const Post = require('./post');
require('dotenv').config();
const { avatarUpload } = require('../configs/upload');

const bcrypt = require('bcrypt');
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    accessToken:
    {
        type: String
    },
    isTokenValid:
    {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpires: { 
        type: Date 
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
}, {
    timestamps: true
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    if (!this.password) return next();
    try {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.pre('remove', async function(next) {
    try {
        await Post.find({ user: this._id }).then(async posts => {
            for (let post of posts) {
                await post.remove();
            }
        });
        next();
    } catch (err) {
        next(err);
    }
});


userSchema.statics.uploadedAvatar = avatarUpload;
const User = mongoose.model('User', userSchema);

module.exports = User;