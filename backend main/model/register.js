const mongoose=require('mongoose')

const reg=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
});

const register=mongoose.model("myUsers",reg);
module.exports=register;