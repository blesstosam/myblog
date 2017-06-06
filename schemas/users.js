
var mongoose=require('mongoose');


//用户表数据结构
module.exports = new mongoose.Schema({

    username: String,
    password: String,

    isAdmin:{
        type: Boolean,
        default: false
    }

});