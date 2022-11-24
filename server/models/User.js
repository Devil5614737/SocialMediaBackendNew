const mongoose=require('mongoose');
const jwt=require('jsonwebtoken')

const default_profile_pic='https://t3.ftcdn.net/jpg/03/81/60/06/240_F_381600693_JT5mluWhADxJU7GtzYvHgkFI7Ecl8iqI.jpg'

const userSchema=new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    pic:{
        default:default_profile_pic,
        type:String
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
})

userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.SECRET_KEY)
    return token
  }



const User=mongoose.model("User",userSchema);

module.exports=User;