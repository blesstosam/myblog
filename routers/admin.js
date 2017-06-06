
var express=require('express');
var router=express.Router();


var User=require('../models/User');
var Category=require('../models/Categories');
var Content=require('../models/Content');



//判断是否为管理员
router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        res.send('您没有权限...');
        return;
    }
    next();
});

router.get('/',function (req,res,next) {

    res.render('./admin/index',{
        userInfo:req.userInfo
    });

});



/**
 * 用户管理
 * 分页管理
 */
router.get('/user',function (req,res,next) {

    /**
     * 从数据库读取用户信息
     * limit(num)限定数据条数
     * skip(num)忽略的数据条数
     * req.query：url传的参数
     * count():查找总条数
     */
    var page=Number(req.query.page || 1);
    var limit=3;
    var skip=0;
    var pages=0;   //总页数


    User.count().then(function (count) {

        //计算总页数
        pages=Math.ceil(count/limit);
        //设置页数不大于总页数
        page=Math.min(page,pages);
        //设置页数不小于1
        page=Math.max(page,1);
        skip=(page-1)*limit;

        User.find().limit(limit).skip(skip).then(function (users) {

            res.render('./admin/user_index',{

                userInfo:req.userInfo,
                users:users,

                pages:pages,
                page:page

            });
        });

    });

});


/**
 * 分类管理首页
 *
 */
router.get('/category',function (req,res,next) {

    /**
     * 从数据库读取分类信息
     * limit(num)限定数据条数
     * skip(num)忽略的数据条数
     * req.query：url传的参数
     * sort()排序,1表示升序，2表示降序
     * count():查找总条数
     */
    var page=Number(req.query.page || 1);
    var limit=3;
    var skip=0;
    var pages=0;   //总页数


    Category.count().then(function (count) {

        //计算总页数
        pages=Math.ceil(count/limit);
        //设置页数不大于总页数
        page=Math.min(page,pages);
        //设置页数不小于1
        page=Math.max(page,1);
        skip=(page-1)*limit;

        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categories) {

            res.render('./admin/category_index',{

                userInfo:req.userInfo,
                categories:categories,

                pages:pages,
                page:page

            });
        });

    });

});


/**
 * 分类添加
 * get表示访问该页面
 */
router.get('/category/add',function (req,res,next) {

    res.render('./admin/category_add',{

        userInfo:req.userInfo

    })

});


/**
 * 分类添加保存
 * post表示用户提交表单
 */
router.post('/category/add',function (req,res,next) {

    var name=req.body.name || '';
    if(name==''){
        res.render('./admin/error',{
            userInfo:req.userInfo,
            message:'分类名称不能为空'
        });
        return;
    }

    //查找是否存在当前分类
    Category.findOne({
        name:name
    }).then(function (result) {
        if(result){
            res.render('./admin/error',{
                userInfo:req.userInfo,
                message:'该分类已经存在'
            });
            return Promise.reject();
        }else{
            return new Category({
                name:name
            }).save();
        }
    }).then(function (newCategory) {

        res.render('./admin/success',{
            userInfo:req.userInfo,
            message:'分类保存成功',
            url:'/admin/category'
        })
    });


});


/**
 * 分类的修改
 */
router.get('/category/edit',function (req,res) {

    //获取_id，查找分类并用表单形式显示
    var _id=req.query.id || '';
    Category.findOne({
        _id:_id
    }).then(function (category) {
        if(!category){
            res.render('./admin/error',{
                userInfo:req.userInfo,
                message:'该分类不存在'
            });
            return Promise.reject();
        }else{
            res.render('./admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            })
        }
    })

});
/**
 * 分类的修改保存
 * post表示用户提交表单
 */
router.post('/category/edit',function (req,res) {

    //获取要修改的_id
    var _id=req.query.id || '';
    var name=req.body.name || '';

    if(name==''){
        res.render('./admin/error',{
            userInfo:req.userInfo,
            message:'分类名称不能为空'
        });
        return;
    }

    //查找是否存在当前分类
    Category.findOne({
        _id:_id
    }).then(function (category) {
        if(!category){
            res.render('./admin/error',{
                userInfo:req.userInfo,
                message:'该分类不存在',
            });
            return Promise.reject();
        }else{

            //如果用户没有修改
            if(category.name==name){
                res.render('./admin/success',{
                    userInfo:req.userInfo,
                    message:'修改成功',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else{
                return Category.findOne({
                    _id:{$ne:_id},
                    name:name
                });
            }
        }
    }).then(function (sameCategory) {

        if(sameCategory){
            res.render('./admin/error',{
                userInfo:req.userInfo,
                message:'该分类已存在',
                url:'/admin/category/edit?id='+_id
            });
            return Promise.reject();     //只要下面还有then()就要return一个Promise对象
        }else{

            //修改数据库
            return Category.update({
                _id:_id
            },{
                name:name
            })
        }
    }).then(function () {
        res.render('./admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        });
    });

});



/**
 * 分类的删除
 */
router.get('/category/delete',function (req,res) {

    //接收_id
    var _id=req.query.id || '';

    Category.remove({
        _id:_id
    }).then(function () {
        res.render('./admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/category'
        });
    })

});


/**
 * 内容首页
 */
router.get('/content',function (req,res) {

    /**
     * 从数据库读取分类信息
     * limit(num)限定数据条数
     * skip(num)忽略的数据条数
     * req.query：url传的参数
     * sort()排序,1表示升序，2表示降序
     * count():查找总条数
     */
    var page=Number(req.query.page || 1);
    var limit=3;
    var skip=0;
    var pages=0;   //总页数


    Content.count().then(function (count) {

        //计算总页数
        pages=Math.ceil(count/limit);
        //设置页数不大于总页数
        page=Math.min(page,pages);
        //设置页数不小于1
        page=Math.max(page,1);
        skip=(page-1)*limit;

        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).
        then(function (contents) {
            res.render('./admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,

                pages:pages,
                page:page

            });
        });

    });

});



/**
 * 内容添加页面
 */
router.get('/content/add',function (req,res) {

    //查找所有分类
    Category.find().then(function (categories) {

        res.render('./admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
        })

    });

});

/**
 * 内容添加保存
 */
router.post('/content/add',function (req,res) {

    var _id=req.body.category;
    var _title=req.body.title;
    var _desc=req.body.desc;
    var _content=req.body.content;

    if(req.body.title==''){
        res.render('./admin/error',{
            userInfo:req.userInfo,
            message:'标题不能为空',
            url:'/admin/content/add'
        });
        return;
    }
    Content.findOne({
        title:_title
    }).then(function (title) {
        if(title){
            res.render('./admin/error',{
                userInfo:req.userInfo,
                message:'此标题重复，请修改',
                url:'/admin/content/add'
            });
            return Promise.reject();
        }else{
            return new Content({
                category:_id,
                title:_title,
                user:req.userInfo._id.toString(),
                desc:_desc,
                content:_content
            }).save();
        }
    }).then(function (rs) {

        //console.log(rs)
        res.render('./admin/success',{
            userInfo:req.userInfo,
            message:'添加成功',
            url:'/admin/content'
        })
    })

});



/**
 * 内容修改
 */
router.get('/content/edit',function (req,res) {

    var _id=req.query.id || '';
    var categories=[];

    Category.find().sort({_id:-1}).then(function (rs) {

        categories=rs;

        return Content.findOne({
            _id:_id
        }).populate('category');

    }).then(function (content) {

        if(!content){
            res.render('./admin/error',{
                userInfo:req.userInfo,
                message:'该文章未找到'
            });
            return Promise.reject();
        }else{

            res.render('./admin/content_edit',{
                userInfo:req.userInfo,
                categories:categories,
                content:content
            });
        }
    })

});

/**
 * 内容修改保存
 */
router.post('/content/edit',function (req,res) {

    //从url传过来的id
    var id=req.query.id || '';

    var _id=req.body.category;
    var _title=req.body.title;
    var _desc=req.body.desc;
    var _content=req.body.content;

    if(req.body.title==''){
        res.render('./admin/error',{
            userInfo:req.userInfo,
            message:'标题不能为空',
            url:'/admin/content/add'
        });
        return;
    }

    Content.update({
        _id:id
    },{
        category:_id,
        title:_title,
        desc:_desc,
        content:_content
    }).then(function () {
        res.render('./admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/content'
        })
    });

});


/**
 * 内容删除
 */
router.get('/content/delete',function (req,res) {

    var _id=req.query.id || '';

    Content.remove({
        _id:_id
    }).then(function (rs) {

        //console.log(rs);
        res.render('./admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/content'
        })
    })

});





module.exports=router;   //直接返回router函数而不是一个对象


























