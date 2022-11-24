const mongoose=require('mongoose');


const connectDB=async()=>{
    const conn=await mongoose.connect(process.env.URI)
    console.log(`MongDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}


module.exports=connectDB;