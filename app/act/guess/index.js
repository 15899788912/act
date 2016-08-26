/*猜球赢大奖*/
(function($){
	var _ = this; 
	var mySwiper;
	var guUrlObj={
    	"desktop":"http://192.168.10.242:8181",
        "development": "http://m.1332255.com",
        "production": "http://m.13322.com"
  	}
	// 开始答题
	$(".teamvs").on("click",function(event) {
		guAnswer(event);
	});
	$(".into").on("click",function(event) {
		guAnswer(event);
	});
	$(".gu_title").on("click",function(event) {
		guAnswer(event);
	});
	//答题方法
	function guAnswer(event){
		var target=$(event.currentTarget);
		target.closest('div[class$=contain]').hide();
		$(".ans_contain").show();
		document.body.scrollTop=0;//回到顶部
		//初始化Swiper
		mySwiper=new Swiper ('.swiper-container' ,{
			onSlideChangeEnd:function(swiper){
				if(swiper.activeIndex==0){
					$(".back").show();
				}else{
					$(".back").hide();
				}
			}
		});
	}
	//活动规则
	$(".btn_rule").on("click",function(event) {
		var target=$(event.currentTarget);
		target.closest('.contain').hide();
		$(".res_contain").show();
		document.body.scrollTop=0;//回到顶部
	});
	//关闭浮层,开始答题
	$(".btn_close").on("click",function(event) {
		guAnswer(event);
	});
	//关闭music
	$("#musicBtn").on("click",function(event){
		var target=$(event.currentTarget);
		var audio=$("#autoplay")[0];
		if (audio.paused) {
            audio.play();
            target.addClass('on');
        } else {
            audio.pause();
            target.removeClass('on');
        }
	});
	//返回
	$(".back").on("click",function(event){
		var target=$(event.currentTarget);
		target.closest('.ans_contain').hide();
		target.closest('.foc_contain').hide();
		$(".contain").show();
	});
	//选择答案
	$(".cho_list label").on("click",function(event){
		var target=$(event.currentTarget);
		target.siblings("label").removeClass("checked");
		target.siblings("input").removeAttr('checked');
		target.addClass("checked");
		target.prev("input").attr("checked","checked");
		mySwiper.slideNext();
	});
	$(".btn_submit").on("click",function(event){
		var target=$(event.currentTarget);
		var fmObj= $('#ansForm');
        var fmData=fmObj.serializeArray();
        var usName=target.siblings("#userName");
        var phone=target.siblings("#userPhone");
        var guList={};
        // console.log(fmData.length);
        if(fmData.length!=6){
        	_.userMsg = '亲，您还没有答完题哦，请滑动返回答题。';
			errorTip(); //错误提示
			return false;
        }
        guList['choList']=fmData;
        guList['userName']=usName.val();
        guList['phone']=phone.val();
        guList['deadline']='2016-5-29 01:00:00'; //截止时间
        // console.log({guessList:guList});
        var valData={'phoneVal':phone.val(),'usNameVal':usName.val()};
        if(!validateInfo(valData)){
        	errorTip(); //错误提示
            return false;
        }
        //防网络延迟重复提交
        var nowTime = new Date().getTime();
	    var clickTime = $(this).attr("ctime");
	    if( clickTime != 'undefined' && (nowTime - clickTime < 5000)){
	        _.userMsg = '操作过于频繁，稍后再试';
			errorTip(); //错误提示
	        return false;
	     }else{
	        $(this).attr("ctime",nowTime);
	     } 
        //异步请求
        var urlInfo=guUrlObj["production"]+'/mlottery/core/activity.subGuessData.do';
        $.ajax({
        	type:'POST',
        	url:urlInfo, 
        	data:{guessList:JSON.stringify(guList),callback:'?'}, 
        	beforeSend:function(){$("#J_Mask").show();},//loading
        	timeout:5000,
            success:function(data) {
	        	switch (data.status){
					case '0':
					  setTimeout(function(){$('.ans_contain').hide();$(".foc_contain").show();},500);
					  break;
					case '1':
					  _.userMsg = '活动已结束';
					  errorTip(); //错误提示
					  setTimeout(function(){$('.ans_contain').hide();$(".foc_contain").show();},1500);
					  break;
					case '2':
					  _.userMsg = '您已参加该活动';
					  errorTip(); //错误提示
					  break;
					case '3':
					  _.userMsg = '请正确输入11位手机号';
					  errorTip(); //错误提示
					  break;
				} 
	        },
	        error:function(xhr, errorType, error){
	        	_.userMsg='提交失败，请检查网络重新提交';
	        	errorTip();//错误提示
	        },
			complete:function(){$("#J_Mask").hide();}//隐藏loading
    	});
	});
	/*tips错误提示*/
	function errorTip(){
		var _=this;
		var tipBox=$(".tips");
		tipBox.show();
    	tipBox.find(".t_info").html(_.userMsg);
    	setTimeout(function(){tipBox.hide()},1500);
	}
	//验证信息
    function validateInfo(data){
        var _=this;
        var deadline=new Date('2016-5-29 01:00:00');  //截止时间
        var currTime=new Date();  //当前日期
        var reg = "[`~\\\\!@#\$%\^&\*\(\)_\+<>\?:\"{},\.\/;'\[\\]]";
        if(data.usNameVal.match(reg)){ 
            _.userMsg = '用户名包含非法字符';
            return false;
        }
        if($.trim(data.phoneVal)== ""||$.trim(data.usNameVal)== ""){ 
            _.userMsg = '用户名或手机号不能为空';
            return false;
        }
        if(!data.phoneVal.match(/1[34578]\d{9}(?=,|$)/g)){
            _.userMsg = '请正确输入11位手机号';
            return false;
        }
        if(deadline.getTime()<currTime.getTime()){
        	_.userMsg = '活动已结束';
        	setTimeout(function(){$('.ans_contain').hide();$(".foc_contain").show();},2000);
            return false;
        }
        return true;
    }
    //判断是否为微信
	if(mobileUtil.isWeixin){
		$("#gu_focus").show();
		$("#gu_jx").hide();
	}
	$("#gu_focus").on("click",function(event) {
		// 链接至微信端
		location.href='http://dwz.cn/3oThKd';
	});
	//微信分享
	var shareParam={
		url:window.location.href,
		desc :'马竞是否会一路披荆斩棘，首度捧起大耳朵杯？',
        title :'直通圣西罗，欧冠狂欢夜',
        imgUrl : guUrlObj["production"]+'/active/act/guess/img/wx_icon.jpg'
	}
	WxUtil.share("",shareParam);
})(Zepto);