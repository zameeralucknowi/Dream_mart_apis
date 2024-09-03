const express = require('express')
const router = express.Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');
const User = require('../models/User');

// update user
router.put('/:id',verifyTokenAndAuthorization,async(req,res)=>{
    try {
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.user.id,
            {$set:req.body},
            {new:true}
        )
        return res.status(200).json(updatedUser)
    } catch (error) {
        return res.status(500).json(error)
    }

})

// delete user
router.delete('/:id',verifyTokenAndAuthorization,async(req,res)=>{
    try {
        await User.findByIdAndDelete(req.params.id);   
        return res.status(200).json("user deleted")
    } catch (error) {
        return res.status(500).json(error)
    }
})

// get all users
router.get('/',verifyTokenAndAdmin,async(req,res)=>{
    try {
       const users =  await User.find();   
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error)
    }
})

// stats of all 
router.get('/stats',verifyTokenAndAdmin,async(req,res)=>{
    const date = new Date(0);
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
    try {
        const data = await User.aggregate(
            [
               {$match : {createdAt:{$gte:lastYear} }},
               {
                $project:{
                    month : {$month:"$createdAt"}
                }
               },
               {
                $group:{
                    _id : "$month",
                    total : {$sum:1}
                }
               }
            ]
        )
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error)
    }
})


module.exports = router