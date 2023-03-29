const Movie_Router = require('express').Router()
const Movie = require('../models/Movie')
const Verify = require('../verifyToken')

//Create a movie
Movie_Router.post('/create',Verify,async(req,res)=>{
    if(req.user.isAdmin){
        try {
            const movie = new Movie(req.body)
            const savedmovie = await movie.save()
            res.status(201).json(savedmovie)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json('Access Denied')
    }
})

//update a movie
Movie_Router.put('/update/:id',Verify,async(req,res)=>{
    if(req.user.isAdmin){
        try {
            const movie = await Movie.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
            res.status(200).json(movie)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json('Access Denied')
    }
})

//Delete a movie
Movie_Router.delete('/delete/:id',Verify,async(req,res)=>{
    if(req.user.isAdmin){
        try {
            const movie =await Movie.findByIdAndDelete(req.params.id)
            res.status(200).json(movie)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json('Access Denied')
    }
})

//GET a random movie
Movie_Router.get('/random',async(req,res)=>{
    const type = req.query.type
    if(type&&type==='series'){
        try {
            const movie = await Movie.aggregate(
                [
                    {
                        $match:{
                            isSeries:true
                        }    
                    },
                    {
                        $sample:{
                            size:1
                        }
                    }
                ]
            )
            res.status(200).json(movie)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        try {
            const movie =await Movie.aggregate([
                {
                    $match:{
                        isSeries:false
                    }
                },
                
                {
                    $sample:{
                        size:1
                    }
                }
            ])
            res.status(200).json(movie)
        } catch (error) {
            res.status(500).json(error)
        }
    }      
})

//get all movie
Movie_Router.get('/all',Verify,async(req,res)=>{
    if(req.user.isAdmin){
        try {
            const movies = await Movie.find()
            res.status(201).json(movies)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json('Access Denied')
    }
})

module.exports = Movie_Router