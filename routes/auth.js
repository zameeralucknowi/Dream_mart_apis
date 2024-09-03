const express = require('express')
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendSignUpEmail = require('./sendEmail')


// register
router.post('/register', async (req, res) => {
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({email});
        if(user)
        return res.status(409).json("Email already Exists");
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName: userName,
            email: email,
            password: hashedPassword
        })
        const savedUser = await newUser.save();
        await sendSignUpEmail(
            email,
            'Welcome to Our Application!!!',
            `Hello ${userName},<br><br>Thank you for signing up on our platform!`
        );
        res.status(201).json(savedUser);

    } catch (error) {
        res.status(500).json(error);
    }

})

// login
router.post('/login', async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email});
        if(!user){
           return res.status(401).json("Wrong credentials")
        }
        const checkPassword =  await bcrypt.compare(password,user.password);
        if(checkPassword){
            const accessToken = jwt.sign(
                {
                    id : user._id,
                    isAdmin : user.isAdmin
                },
                process.env.JWT_SEC,
                {expiresIn:'3d'}
            )
            const {password,...others} = user._doc;
            return res.status(200).json({...others,accessToken});
        }
        else{
            return res.status(401).json("Wrong userName or Password"); 
        }
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router