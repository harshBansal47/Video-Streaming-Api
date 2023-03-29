const express = require('express')
const app = express()

//Using middlewares to parse json data
app.use(express.json())

// importing and using router
const Auth_router = require('./routes/Auth')
const User_router = require('./routes/Users')
const Movie_Router = require('./routes/Movie')
const List_router = require('./routes/List')
app.use('/api/auth',Auth_router)
app.use('/api/user',User_router)
app.use('/api/movies',Movie_Router)
app.use('/api/list',List_router)

//connecting to database
const connectDb = require('./Config/MongoDb')
connectDb()

//starting server
const {PORT} = require('./Config/Index')
app.listen(PORT,()=>{
    console.log(`connection established to port ${PORT}`)
})