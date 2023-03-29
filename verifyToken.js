const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('./Config/Index')

const verify = async(req,res,next) =>{
    const authheader = req.headers.token;
    if(!authheader){
        res.status(401).json("Not a authenticated user")
        
    }else{
        const token = authheader.split(" ")[1]
        await jwt.verify(token,SECRET_KEY,(err,data)=>{
        if(err){
           return res.status(401).json("Different user is trying to access")
        }
        req.user = data
        next()
    })
    }  
}
module.exports = verify