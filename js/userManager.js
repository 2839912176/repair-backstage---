var addUserModel;
var updateUserModel;
(function () {
    var form = layui.form;
    form.verify({
        checkUserName: function (value) {
            if (value.length < 5) {
                return "用户名不等小于5位";
            }
        },
        checkPassword: function (value) {
            if (value.length < 5) {
                return "密码不等小于5位";
            }
        }
    });

    form.on('submit(addUserBtn)', function (data) {
        var $ = layui.$;
        var userName = data.field.userName;
        var userPwd = data.field.userPwd;
        $.ajax({
            url: "http://192.168.90.46:8080/repair/user/insert",
            method: "post",
            dataType: "json",
            xhrFields: {
              withCredentials: true
            },
            data: {
                "userName": userName,
                "userPwd": userPwd
            },
            success: function (data) {
                console.log(data)
                if (data.code == 200) {

                    layui.layer.close(addUserModel);
                    layui.table.reload("user-table");

                } else if (data.code == 500) {
                    var layer = layui.layer;
                    layer.alert(data.msg, {icon: 2});
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false;
    });


    form.on('submit(updateUserBtn)', function (data) {

        //var userId = layui.$("#editUserForm input[name='userId']").val();
        var userId = data.field.userId;
        var userName = data.field.userName;
        var userPwd = data.field.userPwd;
        layui.$.ajax({
            url: "http://192.168.90.46:8080/repair/user/updateUser",
            method: "put",
            dataType: "json",
            xhrFields: {
              withCredentials: true
            },
            data: {
                "userId": userId,
                "userName": userName,
                "userPwd": userPwd
            },
            success: function (data) {
                console.log(data)
                if (data.code == 200) {
                    layui.layer.close(updateUserModel);
                    layui.table.reload("user-table");

                } else if (data.code == 500) {
                    layui.layer.alert(data.msg, {icon: 2});
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
        return false;
    });
})();
//匿名函数
//可以避免变量污染全局作用域
(function () {
    var table = layui.table;
    //第一个实例
    table.render({
        elem: '#user-table'
        , height: 500
        , url: 'http://192.168.90.46:8080/repair/user/findByPage' //数据接口
        , page: true //开启分页
        ,request: {
            pageName: 'pageNumber' //页码的参数名称，默认：page
            ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
        }
        , cols: [[ //表头
            {type: 'checkbox', fixed: 'left'}
            , {field: 'userId', title: '用户Id', width: 150, sort: true}
            , {field: 'userName', title: '用户名', width: 150}
            , {field: 'userPwd', title: '密码', width: 150}
            , {field: 'createTime', title: '创建时间', width: 250}
            , {field: 'updateTime', title: '更新时间', width: 250}

        ]]
        , limit: 10
        , response: {
            statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
        }
        , parseData: function (res) { //res 即为原始返回的数据
            console.log(res.code);
            return {
                "code": res.code, //解析接口状态
                "msg": res.msg, //解析提示文本
                "count": res.data.total, //解析数据长度
                "data": res.data.list //解析数据列表
            };
        }
        ,where:{
            "userName":layui.$("input[name='searchUserName']").val()
        }
    });
})();

//验证信息提示
function qxMsg(msgStr) {
    var layer = layui.layer;

    layer.open({
        type: 1,
        title: '提示消息',
        offset: '10%;',
        content: '<div style="padding: 20px 80px;">' + msgStr + '</div>',
        btn: '关闭',
        btnAlign: 'c',
        shade: 0.2,
        yes: function (index, layero) {
            layer.close(index);
        }
    });
}

function clearForm() {
    var $ = layui.$;
    $("input[name='userName']").val("");
    $("input[name='userPwd']").val("");
    $("input[name='userAge']").val("");
}


function editUser() {
    //获取被选中项
    var checkStatus = layui.table.checkStatus('user-table'); //idTest 即为基础参数 id 对应的值
    if (checkStatus.data.length == 0) {
        layui.layer.alert("请选择数据", {icon: 2});
        return;
    }

    if (checkStatus.data.length > 1) {
        layui.layer.alert("请选择一条数据", {icon: 2});
        return;
    }

    var userId = checkStatus.data[0].userId;
    //从后台加载数据
    layui.$.ajax({
        url: "http://192.168.90.46:8080/repair/user/findById/" + userId,
        method: "get",
        dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        success: function (result) {
            console.log(result.data);
            //填充到编辑框中
            layui.$("#editUserModel input[name='userId']").val(result.data.userId);
            layui.$("#editUserModel input[name='userName']").val(result.data.userName);
            layui.$("#editUserModel input[name='userPwd']").val(result.data.userPwd);

            //展示编辑框
            updateUserModel = layui.layer.open({
                type: 1,
                title: "编辑用户信息",
                content: layui.$("#editUserModel")
            });
            //点击确定提交

        }
    });


}

function showAddModel() {
    clearForm();
    var layer = layui.layer;
    var $ = layui.$;
    addUserModel = layer.open({
        type: 1,
        title: "添加用户信息",
        content: $("#addUserModel")

    });
}

function reloadTable() {
    var table = layui.table;
    table.reload("user-table");
}

function searchUser() {
    layui.table.reload("user-table",{
        where:{
            "userName":layui.$("input[name='searchUserName']").val()
        }
    });
}

function deleteUser() {
    //获取被选中项
    var checkStatus = layui.table.checkStatus('user-table'); //idTest 即为基础参数 id 对应的值
    if (checkStatus.data.length == 0) {
        layui.layer.alert("请选择数据", {icon: 2});
        return;
    }
    console.log(checkStatus.data);
    var userIds = new Array();
    for (let i = 0; i < checkStatus.data.length; i++) {
        userIds.push(checkStatus.data[i].userId);
    }

    layui.$.ajax({
        url: "http://192.168.90.46:8080/repair/user/batchDelete?userIds=" + userIds.join(),
        method: "delete",
        dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
            layui.layer.alert(data.msg, {icon: 1});
            layui.table.reload("user-table");
        }, error: function (data) {

        }
    });
}