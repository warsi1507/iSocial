const User = require('../models/user');
const Friendship = require('../models/friendship')
const Post = require('../models/post')
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const queue = require('../configs/bull');
const userEmailWorker = require('../workers/resetPassword_email_worker');
const verifyEmailWorker = require('../workers/verify_email_worker');

function isStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

module.exports.profile = async function (req, res) {
    try {
        let currentUser = await User.findById(req.user._id).populate('friends blockedUsers');
        
        let profileUser = await User.findById(req.params.id).populate('friends blockedUsers');

        if (!profileUser) {
            return res.status(404).send('User not found');
        }

        let isFriend = currentUser.friends.some(friendId => friendId.equals(profileUser._id));

        let requestSent = await Friendship.findOne({ from_user: currentUser._id, to_user: profileUser._id });
        let requestReceived = await Friendship.findOne({ from_user: profileUser._id, to_user: currentUser._id });

        let hasSentRequest = !!requestSent;
        let hasReceivedRequest = !!requestReceived;
        let friendRequestId = requestReceived ? requestReceived.from_user._id : null;
        

        let isBlocked = currentUser.blockedUsers.some(blockedId => blockedId.equals(profileUser._id));
        let isBlockedBy = profileUser.blockedUsers.some(blockedId => blockedId.equals(currentUser._id));

        let posts = await Post.find({user: profileUser._id}).sort('-createdAt')
            .populate({
                path: 'user',
                select: 'name avatar'
            })
            .populate('likes')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'name avatar'
                },
                options: { sort: { 'createdAt': -1 } }
            });
        
            
        return res.render('user_profile', {
            title: `${profileUser.name}'s Profile`,
            user: currentUser,
            profile_user: profileUser,
            isFriend: isFriend,
            hasSentRequest: hasSentRequest,
            hasReceivedRequest: hasReceivedRequest,
            friendRequestId: friendRequestId,
            isBlocked: isBlocked,
            isBlockedBy: isBlockedBy,
            posts: posts
        });

    } catch (err) {
        console.error('Error loading profile:', err);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports.update = async function(req, res){
    try {
        if(req.user.id == req.params.id){
           let user = await User.findById(req.params.id)
            User.uploadedAvatar(req, res, async function(err){
                if(err) {console.log('Multer Error:',err);}

                user.name = req.body.name;
                if(req.body.email && req.body.email !== user.email){
                    user.email = req.body.email;
                    user.isVerified = false;
                    const verificationToken = crypto.randomBytes(20).toString('hex');
                    user.verificationToken = verificationToken;
                    newUser.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    
                    await queue.add('verification_emails', user, {
                        attempts: 3,
                        backoff: 5000
                    });
                }


                if(req.file){
                    user.avatar = req.file.path;
                }
                await user.save();
            });
            req.flash('success', 'User Profile Updated');
            return res.redirect(req.get('Referer') || '/');
        }
        else{
            req.flash('error', 'You are not allowed to update this Profile')
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.error("Error in user profile updating:", err);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('user_sign_up', {
        title: 'iSocial | Sign Up'
    })
}

module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    
    return res.render('user_sign_in', {
        title: 'iSocial | Sign In'
    })
}
 
module.exports.create = async function (req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {
            req.flash('error', 'Password and Confirm Password do not match')
            return res.redirect(req.get('Referer') || '/');
        }

        if (!isStrongPassword(req.body.password)) {
            req.flash('error', 'Password is not strong enough. It must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
            return res.redirect(req.get('Referer') || '/');
        }
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            req.flash('error', 'User with that email-id already exists');
            return res.redirect(req.get('Referer') || '/');
        }

        let newUser = await User.create(req.body);
         
         const verificationToken = crypto.randomBytes(20).toString('hex');
         newUser.verificationToken = verificationToken;
         newUser.isVerified = false;
         newUser.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
         
         await queue.add('verification_emails', newUser, {
             attempts: 3,
             backoff: 5000
        });
            
        await newUser.save();
        console.log("***** User Account Created *****");

        req.flash('success', 'Account created! Please verify your email before signing in.')
        return res.redirect('/users/sign-in');
    } catch (err) {
        console.error("Error in user creation:", err);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports.resetPassword = function(req, res) {
    return res.render('reset_password',
        {
            title: 'iSocial | Reset Password',
            access:false
        }
    );
}

module.exports.resetPassMail = async function(req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });

        if(user){
            if(!user.isTokenValid){
                user.accessToken = crypto.randomBytes(30).toString('hex');
                user.isTokenValid = true;
                await user.save();
            }

            await queue.add('user_rePass_emails', user, {
                attempts: 3,
                backoff: 5000
            });

            req.flash('success', 'Password reset link sent. Please check your mail');
            return res.redirect('/');
        }
        else{
            req.flash('error', 'User with that email-id doesn\'t exists');
            return res.redirect(req.get('Referer') || '/');
        }
    } catch (err) {
        console.error("Error in Resetting Password:", err);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports.setPassword = async function(req, res){
    try {
        let user = await User.findOne({accessToken: req.params.accessToken});
        if(user.isTokenValid)
        {
            return res.render('reset_password',
            {
                title: 'Codeial | Reset Password',
                access: true,
                accessToken: req.params.accessToken
            });
        }
        else
        {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    } catch (err) {
        console.error("Error in Resetting Password:", err);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports.updatePassword = async function(req, res) {
    try {
        let user = await User.findOne({ accessToken: req.params.accessToken });
        if (user.isTokenValid) {
            if (req.body.newPass === req.body.confirmPass) {
                user.password = req.body.newPass;
                user.isTokenValid = false;
                await user.save();
                req.flash('success', "Password updated. Login now!");
                return res.redirect('/users/sign-in');
            } else {
                req.flash('error', "Passwords don't match");
                return res.redirect(req.get('Referer') || '/');
            }
        } else {
            req.flash('error', 'Link expired');
            return res.redirect('/users/reset-password');
        }
    } catch (err) {
        console.error("Error in Resetting Password:", err);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res){
    req.logout(function(err) {
        if (err) {
            console.error('Error during logout:', err);
            return res.redirect('/error');
        }
        req.flash('success', 'Logged out Successfully')
        return res.redirect('/');
    });
}

module.exports.blockUser = async function (req, res) {
    try {
        if (!req.body.id || !req.user._id) {
            return res.status(400).json({ message: 'Invalid request parameters' });
        }
        let userToBlock = await User.findById(req.body.id);
        let currentUser = await User.findById(req.user._id);

        if (!userToBlock) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (currentUser.blockedUsers.includes(userToBlock._id)) {
            return res.status(400).json({ message: 'User already blocked' });
        }

        currentUser.blockedUsers.push(userToBlock._id);
        await currentUser.save();

        req.flash('success', 'User blocked successfully');
        return res.status(200).json({ message: 'User blocked successfully' });

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports.unblockUser = async function (req, res) {
    try {
        if (!req.body.id || !req.user._id) {
            return res.status(400).json({ message: 'Invalid request parameters' });
        }
        let userToUnblock = await User.findById(req.body.id);
        let currentUser = await User.findById(req.user._id);

        if (!userToUnblock) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!currentUser.blockedUsers.includes(userToUnblock._id)) {
            return res.status(400).json({ message: 'User is not blocked' });
        }

        currentUser.blockedUsers = currentUser.blockedUsers.filter(userId => userId.toString() !== userToUnblock._id.toString());
        await currentUser.save();

        req.flash('success', 'User unblocked successfully');
        return res.status(200).json({ message: 'User unblocked successfully' });

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports.friendRequests = async function(req, res) {
    try {
        let requests = await Friendship.find({ to_user: req.user._id }).populate('from_user');
        
        let friendRequests = requests.map(fr => {
            return {
                id: fr.from_user._id,
                name: fr.from_user.name,
                email: fr.from_user.email,
                avatar: fr.from_user.avatar
            };
        });

        return res.render('friend_request', {
            title: "Friend Requests",
            friendRequests: friendRequests
        });
    } catch (err) {
        console.error("Error fetching friend requests:", err);
        return res.redirect('back');
    }
};

module.exports.verifyEmail = async function(req, res) {
    try {
        const token = req.params.token;
        const user = await User.findOne({ verificationToken: token });
        
        if (!user) {
            return res.render('user_verify', {
                title: 'Email Verification',
                message: 'Invalid or expired verification token.'
            });
        }
        
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        
        return res.render('user_verify', {
            title: 'Email Verification',
            message: 'Email verified successfully. You can now log in.'
        });
    } catch (err) {
        console.error("Error during email verification:", err);
        return res.render('user_verify', {
            title: 'Email Verification',
            message: 'An error occurred during email verification.'
        });
    }
};
