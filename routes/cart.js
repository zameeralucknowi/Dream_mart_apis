const express = require('express')
const router = express.Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin,verifyToken} = require('./verifyToken');
const Cart = require('../models/Cart');


// create cart
router.post('/', verifyToken, async(req,res)=>{
        const newCart = new Cart(req.body);
        try {
            const savedCart = await newCart.save();
            return res.status(200).json(savedCart);
        } catch (error) {
            return res.status(500).json(error)
        }
})

// update cart
router.put('/:id',verifyTokenAndAuthorization,async(req,res)=>{
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,
            {$set:req.body},
            {new:true}
        )
        return res.status(200).json(updatedCart)
    } catch (error) {
        return res.status(500).json(error)
    }

})

// delete cart
router.delete('/:id',verifyTokenAndAuthorization,async(req,res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id);   
        return res.status(200).json("Cart deleted")
    } catch (error) {
        return res.status(500).json(error)
    }
})

// get user cart
router.get('/find/:id',verifyTokenAndAuthorization,async(req,res)=>{
    try {
        const cart = await Cart.findOne({userId:req.params.id});
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json(error)
    }
})

// get all carts
router.get('/',verifyTokenAndAdmin, async(req,res)=>{
    try {
        const carts = await Cart.find();
        return res.status(200).json(carts)
        
    } catch (error) {
        return res.status(500).json(error)
    }
})


module.exports = router