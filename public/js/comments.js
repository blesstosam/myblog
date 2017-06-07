
$(function () {


    /**
     * 提交评论
     */
    $('#comBtn').click(function () {

        var _content=$('#comments input').val();
        var _hidden=$('#hidden').val();

        //前台验证用户输入
        if(_content==''){
            $('#warnCom').css("color","red").text('评论不能为空');
            return;
        } else{
            $.ajax({
                type:'post',
                url:'api/comment/post',
                data:{
                    content:_content,
                    id:_hidden
                },
                dataType:'json',
                success:function (res) {
                    if(res.code==4){
                        $('#warnCom').css("color","red").text(res.message);
                    }else{
                        $('#warnCom').css("color","red").text(res.message);
                        setTimeout(function () {
                            $('#warnCom').css("color","red").text('');
                        },1000);
                    }
                }
            })
        }
    });





});
