
var mongoose=require('mongoose');
var usersSchema=require('../schemas/users');



//创建模型
//返回一个构造函数，用于后面创建对象
module.exports=mongoose.model('User', usersSchema);

