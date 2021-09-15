const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:false,
    },
    update_ts:{
        type:Date,
        default:Date.now()
    },
    isActive:{
        type:Boolean,
        require:false,
        default:false
    },

 
})
module.exports = mongoose.model('passwords',userSchema);
