const express = require('express')
const router = express.Router();
const paypal = require('paypal-rest-sdk')
require('dotenv').config();

let transactionsData = {}


router.post('/payment',async(req,res)=>{
    const {products,total} = req.body;
    paypal.configure({
        'mode':'sandbox',
        'client_id':process.env.PAYPAL_CLIENT_ID,
        'client_secret':process.env.PAYPAL_CLIENT_SECRET
    })

    try {
        let create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${process.env.SERVER}/api/checkout/success?total=${total}`,
                "cancel_url": `${process.env.SERVER}/api/checkout/failed`
            },
            "transactions": [{
                "item_list": {
                    "items": products.map(product => ({
                        "name": product.title,
                        "sku": product._id,
                        "price": product.price,
                        "currency": "USD",
                        "quantity": product.quantity,
                      })),
                },
                "amount": {
                    "currency": "USD",
                    "total": total,
                },
                "description": "This is the payment description."
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                data = payment;
               return res.status(200).json(data);
            }
        });
    } catch (error) {
        console.log(error);
    }

})

router.get('/success', async (req, res) => {
    try {

        const total = req.query.total;
        const payerId = req.query.PayerID;   // after payment is done payerId and paymentId is in query string
        const paymentId = req.query.paymentId;
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": total
                }
            }]
        }

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error)
               return  res.redirect('https://dreammart-webapp.onrender.com/failed'); // client side
            } else {
                console.log("Execute Payment Response");
                const response = JSON.stringify(payment);
                const parsedResponse = JSON.parse(response);
                const transactions = parsedResponse.transactions[0];
                console.log("transactions", transactions);
                transactionsData[paymentId]=transactions;
               return  res.redirect(`https://dreammart-webapp.onrender.com/success?paymentId=${paymentId}`); // client side 
            }
        })
    } catch (error) {
        console.log(error);
    }

})

router.get('/failed',(req,res)=>{
    return res.redirect('https://dreammart-webapp.onrender.com/failed'); 
})

router.get('/transactions',(req,res)=>{
    const paymentId = req.query.paymentId;
    if (transactionsData[paymentId]) {
        return res.status(200).json({
            success: true,
            transactions: transactionsData[paymentId]
        });
    } else {
        return res.status(404).json({
            success: false,
            message: 'Transaction not found'
        });
    }
})


module.exports = router