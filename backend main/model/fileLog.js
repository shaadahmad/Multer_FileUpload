const mongoose=require('mongoose')

const log=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    typeOfFile:{
        type:String,
        required:true,
    },
    fileName:{
        type:String,
        required:true,
    }
});

const logFile=mongoose.model("FileLog",log);
module.exports=logFile;