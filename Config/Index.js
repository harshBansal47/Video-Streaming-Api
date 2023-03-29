const dotenv = require('dotenv')
dotenv.config()

const {PORT,MONGO_URI,SECRET_KEY} = process.env;

module.exports = {PORT,MONGO_URI,SECRET_KEY}