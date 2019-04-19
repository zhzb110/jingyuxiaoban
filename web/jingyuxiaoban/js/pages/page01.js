//基本信息
var company='jingyuxiaoban';//品牌
var userId =  randomRange(8)+(new Date()).getTime().toString().slice(11);//userId
var url=window.location.href; //url
var ip=returnCitySN["cip"];//ip
var userAgent=navigator.userAgent;//代理信息
var sign=getRequestByName("sign");
var device=0;
if(/Android|iPhone|BlackBerry/i.test(navigator.userAgent)) {
    device=1;
}else{
    device=0;
}

//打印基本信息
/*console.log(company)
console.log(userId)
console.log(url)
console.log(ip)
console.log(userAgent);
console.log(sign)*/
$(function () {
    $('#phone').bind('input propertychange',function () {
        var Phone=$("#phone").val().trim().length;
        if (Phone ===11 ){
            $(".getCode").css({
                background:'#005bcb',
                color:'#fff'
            })
        }else{
            $(".getCode").css({
                background:'#f2f2f2',
                color:'#b4b4b4'
            })
        }
    })

    //保存页面初始化信息
    $.ajax({
        type:'POST',
        url: 'http://mm.jnrise.cn/loading/server/enter',
        headers:{"Content-Type":"application/x-www-form-urlencoded"},
        data:{
            'company':company,
            'userId':userId,
            'userAgent':userAgent,
            'ip':ip,
            'url':url,
            'sign':sign,
            'flag':2
        },
        dataType: 'json',
        success: function(data){
            //console.log(data);
        },
        error: function(error){
            console.log(error);
        }
    });
    //每秒刷新页面停留时间
    function getTime() {
        var second=0
        var timer=window.setInterval(function () {
            second++
            if (second <= 90){
                $.ajax({
                    type:'POST',
                    url:'http://mm.jnrise.cn/loading/server/stay',
                    headers:{"Content-Type":"application/x-www-form-urlencoded"},
                    data:{
                        'company':company,//品牌名称
                        'userId':userId,//用户ID
                        'url':url,//url
                        'ip':ip,//ip地址
                        'userAgent':userAgent,//代理信息
                        'sign':sign, //url携带的参数信息
                        'totalTime':second,//停留时间秒
                        'otherInfo':''
                    },
                    dataType:'json',
                    success:function (data) {
                        //console.log(data)
                    },
                    error:function (error) {
                        console.log(error)
                    }
                })
            }else{
                window.clearInterval(timer)
            }

        },1000)
    }
    getTime();
})
function getInfo01(element) {
    var Phone=$("#phone").val().trim()
    var Code=$("#code").val().trim()
    var myreg= /^1[3|4|5|7|8][0-9]{9}$/;
    if (!Phone){
        $('.modal-h3').html("请输入手机号")
        $('.modal').css('display','block')
        setTimeout(function () {
            $('.modal').css('display','none')
        },1500)
    }else if (!myreg.test(Phone)){
        $('.modal-h3').html("手机号格式不正确")
        $('.modal').css('display','block')
        setTimeout(function () {
            $('.modal').css('display','none')
        },1500)
    }else{
        if(!Code){
            $('.modal-h3').html("请输入验证码")
            $('.modal').css('display','block')
            setTimeout(function () {
                $('.modal').css('display','none')
            },1500);
        }else{
            $.ajax({
                type:'GET',
                url: 'http://47.92.205.63:21666/sms/getCode?mobile='+Phone+'&code='+Code,
                headers:{"Content-Type":"application/x-www-form-urlencoded"},
                dataType: 'json',
                success: function(data){
                    if(data===200){
                        $.ajax({
                            type:'POST',
                            url: 'http://mm.jnrise.cn/loading/server/info',
                            headers:{"Content-Type":"application/x-www-form-urlencoded"},
                            data:{
                                'company':company,
                                'userId':userId,
                                'phone':Phone,
                                'age':0,
                                'gender':0,
                                'school':'',
                                'url':url,
                                'userAgent':userAgent,
                                'ip':ip,
                                'sign':sign
                            },
                            dataType: 'json',
                            success: function(data){
                                console.log(data);
                                $('.modal-h3').html("领取成功")
                                $('.modal').css('display','block')
                                setTimeout(function () {
                                    $('.modal').css('display','none')
                                },1500)
                            },
                            error: function(error){
                                $('.modal-h3').html("领取失败")
                                $('.modal').css('display','block')
                                setTimeout(function () {
                                    $('.modal').css('display','none')
                                },1500)
                            }
                        });
                    }else{
                        $('.modal-h3').html("验证码错误")
                        $('.modal').css('display','block')
                        setTimeout(function () {
                            $('.modal').css('display','none')
                        },1500)
                    }
                },
                error: function(error){
                    console.log(error);
                }
            })
        }
    }
}
var countdown=90;
function getCode(obj) {
    var Phone=$('#phone').val().trim()
    var myreg= /^1[3|4|5|7|8][0-9]{9}$/;
    if (!Phone){
        $('.modal-h3').html("请输入手机号")
        $('.modal').css('display','block')
        setTimeout(function () {
            $('.modal').css('display','none')
        },1500)
    }else if(!myreg.test(Phone)){
        $('.modal-h3').html("手机号格式不正确")
        $('.modal').css('display','block')
        setTimeout(function () {
            $('.modal').css('display','none')
        },1500)
    }else{
           countdown=90;

           var timers=setInterval(function() {
               countdown--;
               obj.setAttribute("disabled", true);
               obj.value="重新发送" + countdown + "s";

               if(countdown===0){
                   obj.removeAttribute("disabled");
                   obj.value="获取验证码";
                   clearInterval(timers);
               }

              },1000)

        $.ajax({
            type:'GET',
            url: 'http://47.92.205.63:21666/sms/sendCode?mobile='+Phone,
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            dataType: 'json',
            success: function(data){
                if (data === 200) {
                    $('.modal-h3').html("验证码已发送")
                    $('.modal').css('display','block')
                    setTimeout(function () {
                        $('.modal').css('display','none')
                    },1500)
                }else{
                    $('.modal-h3').html("发送失败,稍后重新领取")
                    $('.modal').css('display','block')
                    setTimeout(function () {
                        $('.modal').css('display','none')
                    },1500)
                }
            },
            error: function(error){
                console.log(error);
            }
        })

    }
}
//随机生成10位用户id
function randomRange(min, max){
    var returnStr = "",
        range = (max ? Math.round(Math.random() * (max-min)) + min : min),
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for(var i=0; i<range; i++){
        var index = Math.round(Math.random() * (arr.length-1));
        returnStr += arr[index];
    }
    return returnStr;
}
//获取Url参数
function getRequestByName(name) {
    var url = window.location.search; //获取url中"?"符后的字串
    var result="";
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            if(strs[i].indexOf(name+"=")!=-1){
                result= unescape(strs[i].substring(name.length+1,strs[i].length));
            }
        }
    }
    return result;
}






