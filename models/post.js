const mongoose = require('mongoose')
const Comment = require('./comment');

const multer = require('multer');
const path = require('path');
const POST_IMG_PATH = path.join('/uploads/posts/images');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes:
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    image: {
        type: String,
        default: null
    }
},{
    timestamps: true
})

postSchema.pre('remove', async function(next) {
    try {
        await Comment.deleteMany({ post: this._id });
        next();
    } catch (err) {
        next(err);
    }
});


let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '..', POST_IMG_PATH));
    },
    filename: function(req, file, cb){
        const uniqueFilename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, uniqueFilename);
    }
});

postSchema.statics.uploadImage = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('post_img');
postSchema.statics.postImgPath = POST_IMG_PATH;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;