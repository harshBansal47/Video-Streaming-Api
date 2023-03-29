const mongoose = require("mongoose");
const { MONGO_URI } = require("./Index");

const connectDb = ()=>{
  mongoose.set("strictQuery", false);
    mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => {
    console.log(`connection established to online db`)
  })
  .catch((err) => {
    console.error(err)
  })
}

module.exports = connectDb