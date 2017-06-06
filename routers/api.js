
var express=require('express');
var router=express.Router();
var User=require('../models/User');


router.get('/user',function (req,res,next) {

    res.send('api---user');
});


//定义返回数据
var responseData;

router.use(function (req,res,next) {
    responseData={
        code:0,
        message:''
    };
    next();
});




/**
 * 用户注册
 */
router.post('/user/register',function (req,res,next) {
    var username=req.body.username;   //不能用user做变量,不知道为什么
    var psd=req.body.password;

    //查找数据库是否有相同账号
    //封装用的是Promise对象
    User.findOne({
        username:username
    }).then(function (userInfo) {
        if(userInfo){
            responseData.code=4;     //表示用户名已经存在
            responseData.message='用户名已注册';
            res.json(responseData);
            return;
        }

        //写入数据库
        //利用User的数据模型新建一个对象来操作数据库
        var user=new User({
            username:username,
            password:psd
        });
        return user.save();  //继续返回Promise对象

    }).then(function (newUserInfo) {
        responseData.message='注册成功';
        res.json(responseData);
    });


});


/**
 * 用户登录
 */
router.post('/user/login',function (req,res,next) {
    var username=req.body.username;
    var psd=req.body.password;

    User.findOne({
        username:username,
        password:psd
    }).then(function (userInfo) {

        //如果找到该用户
        if(!userInfo){
            responseData.code=4;
            responseData.message='用户名或密码错误';
            res.json(responseData);
            return;
        }
        if(username==userInfo.username&&psd==userInfo.password){
            responseData.message='登录成功';
            responseData.userInfo={
                username:userInfo.username,
                _id:userInfo._id
            };

            //设置客户端的cookie
            req.cookies.set('userInfo',JSON.stringify({
                username:userInfo.username,
                _id:userInfo._id
            }));
            res.json(responseData);
        }
    })
});


/**
 * 用户退出
 */
router.get('/user/logout',function (req,res,next) {
    req.cookies.set('userInfo',null);
    responseData.message='退出成功';
    res.json(responseData);
});



module.exports=router;   //直接返回router函数而不是一个对象


















