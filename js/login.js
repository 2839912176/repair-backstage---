(function() {
  var form = layui.form;
  form.verify({
    checkUserName: function(value) {
      if (value.length == 0) {
        return "用户名不等为空";
      }
    },
    checkPassword: function(value) {
      if (value.length == 0) {
        return "密码不能为空";
      }
    },
    checkImg: function(value) {
      if (value.length == 0) {
        return "验证码不能为空";
      }
    }
  });

  form.on('submit(loginForm)', function(data) {
    var $ = layui.$;
    var userName = data.field.userName;
    var userPwd = data.field.userPwd;
    var verifyCode = data.field.verifyCode;
    $.ajax({
      url: "http://192.168.90.46:8080/repair/user/login/" + data.field.userName + "/" + data.field.userPwd +
        "/" + data.field.verifyCode,
      method: "get",
      dataType: "json",
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: function(data) {
        console.log(data)
        if (data.code == 200) {
          window.location.href = "index.html";
          return false;
        } else if (data.code == 500) {
          var layer = layui.layer;
          layer.alert(data.msg, {
            icon: 2
          });
        }
      },
      error: function(data) {
        console.log(data);
      }
    });
    return false;
  });
})();

function changeCode() {
  //获取layui自带的jQuery
  var $ = layui.$;
  var $verifyCode = $("#verifyCode");
  $verifyCode.attr("src", "http://192.168.90.46:8080/repair/kaptcha/kaptcha.jpg" + "?data=" + new Date());
}
