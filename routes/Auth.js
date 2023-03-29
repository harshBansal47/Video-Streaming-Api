const express = require('express')
const Users = require('../models/Users')
const {SECRET_KEY} = require('../Config/Index')
const jwt = require('jsonwebtoken')


//for encryption and hashing
const CryptoJS = require('crypto-js')
const router = express.Router()


const RegisterController = async(req,res,next)=>{
    try {
        const newUser = new Users({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password
        })
        newUser.password = CryptoJS.AES.encrypt(newUser.password, SECRET_KEY)
        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(404).json({message:error})
    }
}



const LoginController = async(req,res,next)=>{
    try {
        const user = req.body
        //validating email
        const {email} = user
        const validUser =await Users.findOne({email})
        if(!validUser){
            res.status(500).json("Email is not registered with us")
        }
        //validating password
        const {password} = user
        const bytes = CryptoJS.AES.decrypt(validUser.password, SECRET_KEY);
        const validUserPassword = bytes.toString(CryptoJS.enc.Utf8)
        if(!(password === validUserPassword)){
            res.status(500).json("Incorrect Password")
        }
        const authToken = jwt.sign({id:validUser._id,isAdmin:validUser.isAdmin},SECRET_KEY,{expiresIn:"1d"})
        //sending user in response after validation
        res.status(200).json({validUser,authToken}) 
                     
    } catch (error) {
        res.status(404).json(error)
    }
}



router.route('/register').post(RegisterController)
router.route('/login').post(LoginController)


module.exports = router