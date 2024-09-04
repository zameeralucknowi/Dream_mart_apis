
const path = require('path')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const paypalRoute = require('./routes/paypal')
const cors = require('cors')
dotenv.config();



app.use(cors())
app.use(express.json());
app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);
app.use('/api/products',productRoute)
app.use('/api/orders',orderRoute)
app.use('/api/carts',cartRoute)
app.use('/api/checkout',paypalRoute)

app.use(express.static(path.join(__dirname, 'build')));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DB connnection is successfull")
}).catch((err)=>{
    console.log(err)
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("Backend server? Im listening!!!"); 
})