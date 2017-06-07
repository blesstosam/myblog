
$(function () {

    /**
     * 控制登录注册切换
     */
    $('.toRegister').find('a').click(function () {
        $(this).hide();
        $('.toLogin').find('a').show();
        $('#password2').show().prev().show();
        $('#logonBtn').hide().
        next().show();
    });

    $('.toLogin').find('a').click(function () {
        $(this).hide();
        $('.toRegister').find('a').show();
        $('#password2').hide().prev().hide();
        $('#logonBtn').show().
        next().hide();
    });




    /**
     * 清空按钮
     */
    $('#reset').click(function () {
        $('#username').val('');
        $('#password1').val('');
        $('#password2').val('');
    });


    /**
     * 注册ajax请求
     */
    $('#registerBtn').click(function () {
        var user=$('#username').val();
        var psd1=$('#password1').val();
        var psd2=$('#password2').val();

        //前台验证用户输入
        if(user==''){
            $('#warnMsg').css("color","red").text('用户名不能为空');
            return;
        }
        if(psd1==''){
            $('#warnMsg').css("color","red").text('密码不能为空');
            return;
        }
        if(psd2==''){
            $('#warnMsg').css("color","red").text('密码不能为空');
            return;
        }
        if(psd1!=psd2){
            $('#warnMsg').css("color","red").text('两次密码不相同');
            $('#password2').val('').focus(function () {
                $('#warnMsg').text('');
            });
        }else{
            $.ajax({
                type:'post',
                url:'/api/user/register',
                data:{
                    username:user,
                    password:psd1
                },
                dataType:'json',
                success:function (res) {
                    if(res.code==4){
                        $('#warnMsg').css("color","red").text(res.message);
                    }else{
                        $('#warnMsg').css("color","red").text('注册成功');
                        setTimeout(function () {
                            $('#warnMsg').css("color","red").text('');
                        },1000);
                    }
                }
            })
        }
    });


    /**
     * 登录ajax请求
     */
    $('#logonBtn').click(function () {
        var user=$('#username').val();
        var psd=$('#password1').val();

        if(user==''){
            $('#warnMsg').css("color","red").text('用户名不能为空');
            return;
        }
        if(psd==''){
            $('#warnMsg').css("color","red").text('密码不能为空');
            return;
        }
        $.ajax({
            type:'post',
            url:'/api/user/login',
            dataType:'json',
            data:{
                username:user,
                password:psd
            },
            success:function (res) {
                if(!res.code){

                    //登录成功
                    window.location.reload();

                }else{
                    $('#warnMsg').css("color","red").text(res.message);
                    $('#username').val('').focus(function () {
                        $('#warnMsg').css("color","red").text('');
                    });
                    $('#password1').val('').focus(function () {
                        $('#warnMsg').css("color","red").text('');
                    });
                }
            }
        })

    });



    /**
     * 退出ajax请求
     */
    $('#logout').click(function () {
        $.ajax({
            type:'get',
            url:'/api/user/logout',
            success:function (res) {
                if(!res.code){

                    window.location.reload();
                }
            }
        });
    })


});
