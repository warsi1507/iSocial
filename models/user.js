const mongoose = require('mongoose');
const Post = require('./post');
require('dotenv').config();

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const bcrypt = require('bcrypt');
const SALT_ROUNDS = process.env.SALT_ROUNDS;

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

let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function(req, file, cb){

        const uniqueFilename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, uniqueFilename);
    }
});

userSchema.statics.uploadedAvatar = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);

module.exports = User;