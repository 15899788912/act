// 获取终端的相关信息
var Terminal = {
    // 辨别移动终端类型
    platform : function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            // android终端或者uc浏览器
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            // 是否为iPhone或者QQHD浏览器
            iPhone: u.indexOf('iPhone') > -1 ,
            // 是否iPad
            iPad: u.indexOf('iPad') > -1,
            //是否为webview
            webview:u.indexOf('yibifen')>-1,
            wv:u.substring(u.lastIndexOf(" ")+1,u.lastIndexOf("/"))
        };
    }(),
    // 辨别移动终端的语言：zh-cn、en-us、ko-kr、ja-jp...
    language : (navigator.browserLanguage || navigator.language).toLowerCase()
};
var browser = {
    type : function() {
        var u = navigator.userAgent;
        return {
            MicroMessengerBrowser : u.indexOf("MicroMessenger") > -1,
            MQQBrowser : u.indexOf("MQQBrowser") > -1,
            QQInnerBrowser : u.match(/QQ\//i) == "QQ/"
        };
    }()
};
(function($) {
    // if(self!=top){top.location.href=self.location.href;} //防盗链
	// 根据不同的终端，跳转到不同的地址
	var theUrl = "http://m.13322.com";
	if(Terminal.platform.android){
	    // theUrl = 'http://m.13322.com/upgrade/android/ybf_full_v1.0.3_GF1001.apk';
	}else if(Terminal.platform.iPhone&&!Terminal.platform.webview
        &&Terminal.platform.wv!="Mobile"&&self==top){
		$("#s_down").css("display",'block');
		$('#contentBox').css("marginTop",'30px');
	    theUrl = 'https://itunes.apple.com/cn/app/yi-bi-fen/id1044544499?mt=8';
	}
    //如果是微信浏览器
	$("#s_down").on("click",function(){
		if(browser.type.MicroMessengerBrowser) {
			$("#weixinMask").css("display",'block');
		} else {
			$("#weixinMask").css("display",'none');
			window.location.href = theUrl;
		}	
	})
    $("#weixinMask").on("click",function(event){
        this.style.display="none";
    });
  //分享功能
  var url = encodeURIComponent(location.href.split('#')[0]);
  var urlObj={
        "development": "http://m.1332255.com",
        "production": "http://m.13322.com"
  }
  $.getJSON(urlObj["production"]+'/mlottery/core/info.findWeixinConfig.do?url='+url+'&callback=?',
    function(jssdkConfig){
        jssdkConfig.jsApiList = [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
            ];
        wx.config(jssdkConfig);
      //微信分享
      var wxData = {
        url : window.location.href,
        desc :'一比分，专业的足球比分直播平台',
        title :$(".news-article .title").html(),
        img_url : "http://m.1332255.com/oms/images/icon.png"
      }
      wx.ready(function(){
        //分享到朋友圈
        wx.onMenuShareTimeline({
            title: wxData.title, // 分享标题
            link: wxData.url, // 分享链接
            imgUrl: wxData.img_url, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        //分享给微信朋友
        wx.onMenuShareAppMessage({
            title: wxData.title, // 分享标题
            desc: wxData.desc, // 分享描述
            link: wxData.url, // 分享链接
            imgUrl: wxData.img_url, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        //分享到QQ
        wx.onMenuShareQQ({
            title: wxData.title, // 分享标题
            desc: wxData.desc, // 分享描述
            link: wxData.url, // 分享链接
            imgUrl: wxData.img_url, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        //分享到腾讯微博
        wx.onMenuShareWeibo({
            //title: wxData.title, // 分享标题
            desc: wxData.title+wxData.desc+wxData.url, // 分享描述
            //link: wxData.url, // 分享链接
            //imgUrl: wxData.img_url, // 分享图标
            success: function () { 
               // 用户确认分享后执行的回调函数
            },
            cancel: function () { 
                // 用户取消分享后执行的回调函数
            }
        });
        //分享到QQ空间
        wx.onMenuShareQZone({
            title: wxData.title, // 分享标题
            desc: wxData.desc, // 分享描述
            link: wxData.url, // 分享链接
            imgUrl: wxData.img_url, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });
    }
  );
})(jQuery);