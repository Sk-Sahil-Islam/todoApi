const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const bcryptjs = require('bcryptjs');
const jwt_user = require('../middleware/user_jwt.js');
const jwt = require('jsonwebtoken');


router.get('/', jwt_user, async (req, res, next) => {
    try {
        
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            status: true,
            user: user
        });
    } catch(err) {
        console.log(err.message);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
        next();
    }
})

router.post('/register', async (req, res) => {
    const {userName, email, password} = req.body;

    try{
        const userExits = await User.findOne({email: email});
        if(userExits) {
            // return res.status(409).json({
            //     success: false,
            //     message: "User already exits"
            // })
            return res.status(409).json({msg: "User already exits"})
        }
    
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
    
        let size = 200;
        const avatar = "https://gravatar.com/avatar/?s="+ size +"&d=retro";
    
        const user = await User.create({
            userName: userName,
            email: email,
            password: hashedPassword,
            avatar: avatar
        });
    
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, process.env.jwtUserSecret, {
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;
            res.status(200).json({
                success: true,
                token: token
            });
        });
        
    } catch(err) {
        console.log(err);
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        let user = await User.findOne({
            email: email
        });

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist, please register"
            });
        }

        const isMatch = bcryptjs.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, process.env.jwtUserSecret,{
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;
            res.status(200).json({
                status: true,
                message: 'Login successful',
                token: token,
                user: user
            })
        });
    
    } catch(err) {
        console.log(err.message);
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
});


module.exports = router;