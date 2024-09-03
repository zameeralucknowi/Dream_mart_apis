const express = require('express')
const router = express.Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin,verifyToken} = require('./verifyToken');
const Order = require('../models/Order');


// create order
router.post('/create', async(req,res)=>{
        const newOrder = new Order(req.body);
        try {
            const savedOrder = await newOrder.save();
            return res.status(200).json(savedOrder);
        } catch (error) {
            return res.status(500).json(error)
        }
})

// update order
router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,
            {$set:req.body},
            {new:true}
        )
        return res.status(200).json(updatedOrder)
    } catch (error) {
        return res.status(500).json(error)
    }

})

// delete order
router.delete('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id);   
        return res.status(200).json("Order deleted")
    } catch (error) {
        return res.status(500).json(error)
    }
})

// get user orders
router.get('/find/:id',async(req,res)=>{
    try {
        const orders = await Order.find({userId:req.params.id});
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json(error)
    }
})

// get all orders
router.get('/',verifyTokenAndAdmin, async(req,res)=>{
    try {
        const orders = await Order.find();
        return res.status(200).json(orders)  
    } catch (error) {
        return res.status(500).json(error)
    }
})

// get monthly income 

router.get('/income',verifyTokenAndAdmin,async(req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));

    try {

        const income = await Order.aggregate([
            {$match:{createdAt:{$gte:previousMonth}}},
            {
                $project:{
                    month : {$month:"$createdAt"},
                    sales : "$amount"
                }
            },
            {
                $group:{
                    _id : "$month",
                    total :{$sum:"$sales"}
                }
            }
        ])
        return res.status(200).json(income)
    } catch (error) {
        return res.status(500).json(error)
    }

})


module.exports = router