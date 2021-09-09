const mongoose = require("mongoose");

// mongodb connnect

const connection = async() => {
try {
    await mongoose.connect(process.env.DB,{useNewUrlParser:true,
    useUnifiedTopology:true})
    console.log("MongoDB connection created successfully")

    } catch (error) {
    console.log(error.message);
  }
}
module.exports=connection;
