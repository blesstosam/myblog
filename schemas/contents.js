
var mongoose=require('mongoose');


//内容表数据结构
module.exports = new mongoose.Schema({

    //关联字段--内容分类的id
    category: {
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },

    //内容标题
    title:String,

    //关联字段--用户的id
    user: {
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },


    //内容简介
    desc:{
        type:String,
        default:''
    },

    //添加时间
    addTime:{
        type:Date,
        default:new Date()
    },

    //阅读量
    views:{
        type:Number,
        default:0
    },


    //内容正文
    content:{
        type:String,
        default:''
    },

    //评论
    comments:{
        type:Array,
        default:[]
    }

});