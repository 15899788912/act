// 答题活动
(function($) {
	var _ = this;
	var mySwiper;
	var gu_urlObj = {
		"desktop": "http://192.168.10.242:8181",
		"development": "http://m.1332255.com",
		"production": "http://m.13322.com"
	}
	var guessUrl = gu_urlObj["production"]; //环境切换
	var gameCount = 0;
	var today =  Date.parse(new Date());
	//初始化Swiper
	function initSwiper() {
		mySwiper = new Swiper('.swiper-container', {
			onSlideChangeEnd: function(swiper) {
				if (swiper.activeIndex == 0) {
					$(".back").show();
				} else {
					$(".back").hide();
				}
				if(gameCount!=0)
				{
					if(mySwiper.activeIndex==gameCount){
						$('.ans_contain').addClass('changeBg');
					}else {
						$('.ans_contain').removeClass('changeBg');
					}
				}
			}
		});
	}
	initSwiper();
	function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
	}

	//返回
	$(".back").on("click", function(event) {
		window.location.href = "./index.html";
		document.body.scrollTop = 0; //回到顶部
	});
  //sessionStorage中获取对象
  function getSessionStorage (key){
    return sessionStorage.getItem(key);
  }
  var activityId = getSessionStorage ('activityId'),//主活动id
      activeId = getSessionStorage ('activeId'),//子活动id
			activeName = getSessionStorage ('activeName'),
			activeStarttime = getSessionStorage ('activeStarttime'),
			activeEndtime = getSessionStorage ('activeEndtime'),
			ans_starttime = getSessionStorage ('ans_starttime'),
			ans_endtime = getSessionStorage ('ans_endtime'),
			sign = getSessionStorage ('sign');//签名

  $('title').html(activeName);
  $.ajax({
    type: 'POST',
    url:guessUrl+'/mlottery/core/activity.findQuestionItemList.do?activityId='+activeId,
    dataType: 'json',
    beforeSend: function() {
      $("#J_Mask").show();
    }, //loading
    success: function(data, status, xhr) {
      if(isEmptyObject(data.data)){
        $('.no_found').show();
        return false;
      }
        var dataObj = data.data.list;
        var topicObj=null,
        contentInfo = '',
        resObj = null;
        if(dataObj.length != 0) {
          gameCount=dataObj.length;//问题个数
          for (var i = 0; i < dataObj.length; i++) {
            topicObj = dataObj[i];//问题和答案
            if (topicObj) {
              resObj = topicObj.options;//答案数组
              contentInfo += '<li class="swiper-slide">' +
              '<p class="ans_title">' + (i + 1) + '/' + gameCount + '.' + topicObj.subject + '</p>' +
              '<div class="cho_list">';
              for (var k = 0; k < resObj.length; k++) {
                var queNum=['A','B','C','D','E'];//答案选项
                contentInfo += '<input type="radio" name="' + (i + 1) + 'Que" value="' + queNum[k] + '">' +
                '<label class="cho_con">'+ resObj[k] + '  </label>';
              }
              contentInfo += '</div></li>';
            }
          }
          contentInfo += '<li class="swiper-slide userInfo">' +
          '<p class="res_title">' +
          '请正确填写个人联系方式，我们将以电话通知获奖幸运儿</p>' +
          '<div class="res_info">' +
          '<input type="text" id="userName" placeholder="姓名" maxlength="15"><br>' +
          '<input type="text" id="userPhone" placeholder="手机号" maxlength="11"><br>' +
          '<button type="button" class="btn_submit">提交</button>' +
          '</div></li>	';
          $(".ans_list").html(contentInfo);

          mySwiper.update();
          //选择答案
          $(".cho_list label").on("click", function(event) {
            var target = $(event.currentTarget);
            target.siblings("label").removeClass("checked");
            target.siblings("input").removeAttr('checked');
            target.addClass("checked");
            target.prev("input").attr("checked", "checked");
            mySwiper.slideNext();
          });
          // 点击提交
          $(".btn_submit").on("click", function(event) {
            var target = $(event.currentTarget);
            var fmObj = $('#ansForm');
            var fmData = fmObj.serializeArray();
            var usName = target.siblings("#userName");
            var phone = target.siblings("#userPhone");
            var guList = {};
            if (fmData.length != gameCount) {
              _.userMsg = '亲，您还没有答完题哦，请滑动返回答题。';
              errorTip(); //错误提示
              return false;
            }
            var resDataArr = [];
            for (var i = 0; i < fmData.length; i++) {
              resDataArr.push(fmData[i].value);
            }
            guList['activityId'] = activityId; //主活动id
            guList['objectId'] = activeId; //活动 id
            guList['sign'] = sign;
            guList['resultData'] = resDataArr.toString();
            guList['activityUserId'] = phone.val();
            guList['phone'] = phone.val();
            guList['name'] = usName.val();
            if (!validateInfo(guList)) {
              errorTip(); //错误提示
              return false;
            }
            //防网络延迟重复提交
            var nowTime = Date.parse(new Date());
            var clickTime = $(this).attr("ctime");
            if (clickTime != 'undefined' && (nowTime - clickTime < 5000)) {
              _.userMsg = '操作过于频繁，稍后再试';
              errorTip(); //错误提示
              return false;
            } else {
              $(this).attr("ctime", nowTime);
            }
            //异步请求
            var urlInfo = guessUrl + '/mlottery/core/activity.addActivityQuestionData.do';
            $.ajax({
              type: 'POST',
              url: urlInfo,
              data: guList,
              beforeSend: function() {
                $("#J_Mask").show();
              }, //loading
              timeout: 5000,
              success: function(data) {
                switch (data.result) {
                  case 200:
                  setTimeout(function() {
                    $('.ans_contain').hide();
                    $(".foc_contain").show();
                  }, 500);
                  break;
                  case 1041:
                  _.userMsg = '活动已结束';
                  errorTip(); //错误提示
                  setTimeout(function() {
                    $('.ans_contain').hide();
                    $(".foc_contain").show();
                  }, 1500);
                  break;
                  case 1005:
                  _.userMsg = '您已参加该活动';
                  errorTip(); //错误提示
                  break;
                  case 1006:
                  _.userMsg = '请正确输入11位手机号';
                  errorTip(); //错误提示
                  break;
                  default:
                  _.userMsg=data.message;
                  errorTip();
                }
              },
              error: function(xhr, errorType, error) {
                _.userMsg = '提交失败，请检查网络重新提交';
                errorTip(); //错误提示
              },
              complete: function() {
                $("#J_Mask").hide();
              } //隐藏loading
            });
          });
        }
      },
    complete: function() {
      $("#J_Mask").hide();
    } //隐藏loading
  });

	document.body.scrollTop = 0; //回到顶部


	/*tips错误提示*/
	function errorTip() {
		var _ = this;
		var tipBox = $(".tips");
		tipBox.show();
		tipBox.find(".t_info").html(_.userMsg);
		setTimeout(function() {
			tipBox.hide()
		}, 1500);
	}
	//验证信息
	function validateInfo(data) {
		var _ = this;
		var deadline = ans_endtime; //截止时间
		var currTime = Date.parse(new Date()); //当前时间
		var reg = "[`~\\\\!@#\$%\^&\*\(\)_\+<>\?:\"{},\.\/;'\[\\]]";
		if (data.name.match(reg)) {
			_.userMsg = '用户名包含非法字符';
			return false;
		}
		if ($.trim(data.phone) == "" || $.trim(data.name) == "") {
			if ($.trim(data.phone) == "" && $.trim(data.name) == "") {
				_.userMsg = '用户名和手机号不能为空';
				return false;
			}
			_.userMsg = '用户名或手机号不能为空';
			return false;
		}
		if (!data.phone.match(/1[34578]\d{9}(?=,|$)/g)) {
			_.userMsg = '请正确输入11位手机号';
			return false;
		}
		if (deadline < currTime) {
			_.userMsg = '活动已结束';
			setTimeout(function() {
				$('.ans_contain').hide();
				$(".foc_contain").show();
			}, 2000);
			return false;
		}
		return true;
	}
	//判断是否为微信
	if (mobileUtil.isWeixin) {
		$("#gu_focus").show();
		$("#gu_jx").hide();
	}
	$("#gu_focus").on("click", function(event) {
		// 链接至微信端
		location.href = 'http://dwz.cn/3oThKd';
	});
	//微信分享
	var shareParam = {
		url: guessUrl + '/active/act/olympicGames/index.html',
		title: '争当奥运预言帝，有竞猜更精彩！',
		desc: '争当奥运预言帝，有竞猜更精彩！',
		imgUrl: guessUrl + '/active/act/olympicGames/img/wx_icon.jpg'
	}
	WxUtil.share("", shareParam);
})(Zepto);
