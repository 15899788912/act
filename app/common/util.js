window.mobileUtil = (function(win, doc) {
	var UA = navigator.userAgent,
		isAndroid = /android|adr/gi.test(UA),
		isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid, // 据说某些国产机的UA会同时包含 android iphone 字符
		isMobile = isAndroid || isIos;  // 粗略的判断
    var REMV = 100,hasInitRem = false,needREM = true;    //rem 属性

	return {
		isAndroid: isAndroid,
		isIos: isIos,
		isMobile: isMobile,

        isNewsApp: /NewsApp\/[\d\.]+/gi.test(UA),
		isWeixin: /MicroMessenger/gi.test(UA),
		isQQ: /QQ\/\d/gi.test(UA),
        isQQBrow:/MQQBrowser/gi.test(UA),
		isYixin: /YiXin/gi.test(UA),
		isWeibo: /Weibo/gi.test(UA),
		isTXWeibo: /T(?:X|encent)MicroBlog/gi.test(UA),
        isWebView:/yibifen/gi.test(UA),
        isWindow:/Windows|windows/gi.test(UA),

		tapEvent: isMobile ? 'tap' : 'click',
         // 辨别移动终端的语言：zh-cn、en-us、ko-kr、ja-jp...
        language : (navigator.browserLanguage || navigator.language).toLowerCase(),
        /*
         *rem 算法
         */
        calcREM:function(){
            var size = 640,
            fz = 100,
            baseDom = document.getElementsByTagName("html")[0],
            calcSz = baseDom.getBoundingClientRect().width / size,
            fullSz = calcSz * fz;
            baseDom.style.fontSize = fullSz + "px";
            REMV = fullSz;
        },
        /*
         *初始化REM,window判断
         */
        init:function(){
            if (needREM) {
                if ( !! hasInitRem) {
                    return false;
                } else {
                    this.calcREM();
                    hasInitRem = true;
                }
            }
            //window跳转
            if(this.isWindow&&self==top){
                win.location.href='http://13322.com';
            }
        },
		/**
		 * 转href参数成键值对
		 * @param href {string} 指定的href，默认为当前页href
		 * @returns {object} 键值对
		 */
		getSearch: function(href) {
			href = href || win.location.search;
			var data = {},reg = new RegExp( "([^?|#=&]+)(=([^&]*))?", "g" );
			href && href.replace(reg,function( $0, $1, $2, $3 ){
				data[ $1 ] = $3;
			});
			return data;
		}
	};
})(window, document);
// 默认设置页面REM,window判断
mobileUtil.init();