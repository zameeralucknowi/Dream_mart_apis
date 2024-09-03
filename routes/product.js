const express = require('express')
const router = express.Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');
const Product = require('../models/Product');


// create product
router.post('/', verifyTokenAndAdmin, async(req,res)=>{
        const newProduct = new Product(req.body);
        try {
            const savedProduct = await newProduct.save();
            return res.status(200).json(savedProduct);
        } catch (error) {
            return res.status(500).json(error)
        }
})

// get Product
router.get('/find/:id',async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json(error)
    }
})

// update product
router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            {$set:req.body},
            {new:true}
        )
        return res.status(200).json(updatedProduct)
    } catch (error) {
        return res.status(500).json(error)
    }

})

// delete Product
router.delete('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);   
        return res.status(200).json("Product deleted")
    } catch (error) {
        return res.status(500).json(error)
    }
})



// get all Products
router.get('/',async(req,res)=>{
    try {
        const qNew = req.query.new;
        const qcategory = req.query.category;
        let products =[];
        if(qNew){
            products = await Product.find().sort({createdAt:-1}).limit(1);
        }
        else if(qcategory){
            products = await Product.find({
                categories:{
                    $in : [qcategory]
                }
            })
        }
        else{
            products = await Product.find()
        }
        return res.status(200).json(products)
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = router