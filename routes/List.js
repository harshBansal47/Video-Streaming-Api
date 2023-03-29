const ListRoute = require('express').Router()
const Verify = require('../verifyToken')
const Lists = require('../models/List')


//Create a list
ListRoute.post('/createlist',Verify,async(req,res,next)=>{
    if(req.user.isAdmin){
        try {
            const List = new Lists(req.body)
            const savedList = await List.save()
            res.status(201).json(savedList)   
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("access denied")
    }
})

//Delete a list
ListRoute.delete('/delete/:id',Verify,async(req,res,next)=>{
    if(req.user.isAdmin){
        try {
            const deletedlist =await Lists.findByIdAndDelete(req.params.id)
            res.status(200).json(deletedlist)   
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("access denied")
    }
})

//getting a list
ListRoute.get('/getlist',Verify,async(req,res,next)=>{
    const typeQuery = req.query.type
    const genreQuery = req.query.genre 
    try {
        if(typeQuery){
            if(genreQuery){
                const list = await Lists.aggregate([
                    {$match:{
                        type:typeQuery,genre:genreQuery
                    }},
                    {$sample:{
                        size:10
                    }}
                ])
                res.status(200).json(list)
            }else{
               const list=await Lists.aggregate([
                    {$match:{
                        type:typeQuery
                    }
                    },
                    {$sample:{
                        size:10
                    }}
                ])
                res.status(200).json(list)
            }
        }else{
         const   list = await Lists.aggregate([
                {$sample:{
                    size:10
                }}
            ])
            res.status(200).json(list)
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
})

module.exports = ListRoute