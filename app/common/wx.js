window.WxUtil = (function(win, doc) {  
	return{
		share:function(wu,sp){
	  //分享功能
	  var url = encodeURIComponent(location.href.split('#')[0]);
	  var urlObj={
	        "development": "http://m.1332255.com",
	        "production": "http://m.13322.com"
	  }
	  $.getJSON(urlObj["production"]+'/mlottery/core/info.findWeixinConfig.do?url='+url+'&callback=?',
	    function(jssdkConfig){
	    	// jssdkConfig.debug=true;
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
	        url : sp.url,
	        desc :sp.desc,
	        title :sp.title,
	        img_url : sp.imgUrl
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
	}
  }
})(window, document);