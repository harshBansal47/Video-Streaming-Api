const express = require('express')
const router_updt = express.Router()
const verify = require('../verifyToken')
const Users = require('../models/Users')
const {SECRET_KEY} = require('../Config/Index')
//for encryption and hashing
const CryptoJS = require('crypto-js')

//Update operations
router_updt.put('/:id',verify,async(req,res,next)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            //hashing a incomming password
            req.body.password =  CryptoJS.AES.encrypt(req.body.password, SECRET_KEY).toString()
        }
    }
    try {
         const filter = {_id:req.params.id}
         const update = req.body
         const updtuser = await Users.updateOne(filter,update)
         res.status(200).json(updtuser)
    } catch (error) {
        res.status(500).json(error)
    } 
})


// Delete operations
router_updt.delete('/:id',verify,async(req,res,next)=>{
    if(req.params.id === req.user.id || req.user.isAdmin){
        try {
          const deletedUser =  await Users.findByIdAndDelete(req.params.id)
          res.status(200).json(deletedUser)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Cant access the account")
    }
})


// Access operations
router_updt.get('/find/:id',verify,async(req,res,next)=>{
    if(req.params.id === req.user.id ){
        try {
            const user = await Users.findById(req.params.id)
            const {password , _id,createdAt,updatedAt,...info} = user._doc
            res.status(200).json(info)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Can't access the user")
    }
})
// Aceess All user
router_updt.get('/findAllUsers',verify,async(req,res,next)=>{
    const query = req.query.new;
    if(req.user.isAdmin){
        try {
           const user =  query?await Users.find().limit(10):await Users.find()
           res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("CAN'T ACCESS THE USER")
    }
})

//Access status of users by month
router_updt.get('/stats',verify,async(req,res)=>{
    if(req.user.isAdmin){
        try {
            const data = await Users.aggregate([
                {$project:{
                    monthly:{
                      $month:"$createdAt"
                    }        
                }},
                {
                    $group:{
                        _id:"$monthly",
                        total:{
                            $sum:1
                        }
                    }
                }
            ])
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Access Denied")
    }
})
module.exports = router_updt