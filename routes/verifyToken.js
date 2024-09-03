const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) =>{
    const authHeaders = req.headers.token;
    if(authHeaders){
        const token = authHeaders.split(" ")[1];
        jwt.verify(token,process.env.JWT_SEC, (err,user)=>{
            if(err)
            return res.status(403).json("Invalid Token!!")
            req.user  = user;
            next();
        })
    }
    else{
        return res.status(401).json("You are not Authenticated!!!")
    }
}

const verifyTokenAndAuthorization = (req,res,next) =>{
    verifyToken(req,res,()=>{
       if(req.user.id === req.params.id || req.user.isAdmin){
            next()
       }
       else{
        return res.status(403).json("Not Authorized")
       }
    })
}

const verifyTokenAndAdmin = (req,res,next) =>{
    verifyToken(req,res,()=>{
       if(req.user.isAdmin){
            next()
       }
       else{
        return res.status(403).json("Not Authorized to do the operation")
       }
    })
}

module.exports = {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}