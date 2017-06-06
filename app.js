/**
 * 入口文件
 * 客户端的请求分为两种：动态内容和静态资源
 * 动态内容需要处理业务逻辑，加载模板，解析模板，返回数据
 * 静态资源只需要用app.use()统一处理
 */

var express=require('express');


//引入模板
var swig=require('swig');
//关闭swig默认缓存
swig.setDefaults({cache:false});


//创建app应用 => NodeJs Http.createServer
var app=express();


//引入数据库，连接数据库
var mongoose=require('mongoose');
//使用原生Promise
//mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27018/blog",function (err) {
    if(err){
        console.log('数据库连接失败',err);
    }else{
        console.log('数据库连接成功');
        app.listen(8000);
    }
});


//引入body-parser，用于处理post提交过来的数据
var bodyParser=require('body-parser');
//设置body-parser,在req请求中会有一个body对象保存着post过来的数据
app.use(bodyParser.urlencoded({extended:true}));


//引入数据库用户模型
var User=require('./models/User');


//引入cookie模块,相当于PHP的sessions
var Cookies=require('cookies');
app.use(function (req,res,next) {
   req.cookies=new Cookies(req,res);

    //接受并解析客户端的cookie信息
    //不管什么请求，都会经过这个中间件来验证用户
    req.userInfo={};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo=JSON.parse(req.cookies.get('userInfo'));

            //判断是否为管理员信息
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
                next();
            });

        }catch(e){
            next();
        }
    }else{
        next();
    }
});



//设置静态文件托管
//当url以public开头，就返回public文件夹里的静态文件
app.use('/public',express.static(__dirname+'/public'));



//定义模板引擎
//第一个参数为模板引擎的名称，也是文件后缀名
//第二个参数为解析模板内容的方法
app.engine('html',swig.renderFile);

//设置模板文件存放的目录，参数1为views(死的)，参数2为目录
app.set('views','./views');

//注册，参数1为view engine(死的)，参数2为engine方法的第一个参数保持一致
app.set('view engine', 'html');




/**
 * 分模块开发，分为三个模块
 * 前台模块：app.use('/',require('./routers/main'))
 * API模块：app.use('/api',require('./routers/api'))
 * 后台模块：app.use('/admin',require('./routers/admin'))
 */
app.use('/',require('./routers/main'));
app.use('/api',require('./routers/api'));
app.use('/admin',require('./routers/admin'));














