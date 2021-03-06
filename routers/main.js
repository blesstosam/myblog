
var express=require('express');
var router=express.Router();

var Category=require('../models/Categories');
var Content=require('../models/Content');


/**
 *首页
 */
router.get('/',function (req,res,next) {

    var data={
        userInfo:req.userInfo,
        category:req.query.category || '',
        categories:[],

        count:0,
        page:Number(req.query.page || 1),
        limit:3,
        pages:0
    };
    var skip=0;

    var where={};


    //通过分类来查找
    if(data.category){
        where.category=data.category;
    }

    //查找分类
    Category.find().then(function (categories) {

        data.categories=categories;

        return Content.where(where).count();

    }).then(function (count) {

        data.count=count;

        //计算总页数
        data.pages=Math.ceil(data.count/data.limit);
        //设置页数不大于总页数
        data.page=Math.min(data.page,data.pages);
        //设置页数不小于1
        data.page=Math.max(data.page,1);
        skip=(data.page-1)*data.limit;

        return Content.where(where).find().sort({_id:-1}).limit(data.limit).
        skip(skip).populate(['category','user']);

    }).then(function (contents) {

        data.contents=contents;
        res.render('./main/index',data);

    });

});


/**
 * 内容详情页
 */
router.get('/view',function (req,res) {

    var data={
        userInfo:req.userInfo,
        contentid:req.query.contentid || '',
        categories:[],
        content:{}
    };


    //查找分类
    Category.find().then(function (categories) {

        data.categories=categories;

        return Content.findOne({
            _id:data.contentid
        });

    }).then(function (content) {

        data.content=content;

        //阅读加1并保存
        content.views++;
        content.save();

        res.render('./main/view',data)
    });

});




module.exports=router;   //直接返回router函数而不是一个对象
