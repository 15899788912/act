/*猜球赢大奖*/
(function($) {
	var _ = this;
	var mySwiper;
	var gu_urlObj = {
		"desktop": "http://192.168.10.242:8181",
		"development": "http://m.1332255.com",
		"production": "http://m.13322.com"
	}
	var guessUrl = gu_urlObj["production"]; //环境切换
	//初始化Swiper
	function initSwiper() {
		mySwiper = new Swiper('.swiper-container', {
			onSlideChangeEnd: function(swiper) {
				if (swiper.activeIndex == 0) {
					$(".back").show();
				} else {
					$(".back").hide();
				}
			}
		});
	}
	initSwiper();
	//答题方法
	$.ajax({
		type: 'GET',
		url: '@@ROOT/act/dailyGuess/gameInfo.json',
		dataType: 'json',
		beforeSend: function() {
			$("#J_Mask").show();
		}, //loading
		success: function(data, status, xhr) {
			// console.log(data);
			var dataObj = data.gameList;
			var day = new Date();
			var today = day.Format("MMdd");
			var topicObj = null,
				contentInfo = '',
				resObj = null,
				gameCount = 0,
				isShow = false,
				noFound = true,
				curDay = null,
				dayNum = 6,
				deadlineNum = 0;
			if (dataObj.length != 0) {
				for (var i = 0; i < dataObj.length; i++) {
					curDay = new Date(dataObj[i].date);
					isShow = i == 0 && curDay.Format("MMdd") >= today ? true : false; //提前竞猜第一场
					dayNum++;
					if (curDay.Format("MMdd") == today || isShow) {
						noFound = false;
						deadlineNum = curDay.Format("yyyy-MM-dd");
						$(".ans_list").html("");
						topicObj = dataObj[i].topicList;
						gameCount = topicObj.length;
						$("#gameDayInfo").html(curDay.Format("M") + "月" + curDay.Format("dd") + "日");
						$("#gameNumber").html(dataObj[i].gameNum);
						$(".gameTip").show();
						if (topicObj) {
							for (var j = 0; j < topicObj.length; j++) {
								contentInfo += '<li class="swiper-slide">' +
									'<p class="ans_title">' + (j + 1) + '/' + topicObj.length + '. ' + topicObj[j].topic + '</p>' +
									'<div class="cho_list">';
								resObj = topicObj[j].resultList;
								for (var k = 0; k < resObj.length; k++) {
									contentInfo += '<input type="radio" name="' + (j + 1) + 'Que" value="' + resObj[k].qid + '">' +
										'<label class="cho_con">' + resObj[k].qid + '.  ' + resObj[k].res + '  </label>';
								}
								contentInfo += '</div></li>';
							}
							contentInfo += '<li class="swiper-slide userInfo"><div class="res_tit">' +
								'<img src="@@ROOT/act/dailyGuess/img/fm_title.png"></div>' +
								'<p class="res_title">' +
								'请正确填写个人联系方式，我们将以电话通知获奖幸运儿</p>' +
								'<div class="res_info">' +
								'<input type="text" id="userName" placeholder="姓名" maxlength="15"><br>' +
								'<input type="text" id="userPhone" placeholder="手机号" maxlength="11"><br>' +
								'<button type="button" class="btn_submit">提交</button>' +
								'</div></li>	';
							$(".ans_list").html(contentInfo);
						}
						break;
					} else {
						if (noFound) {
							$(".no_found").show();
						}
						console.log("不是今天数据");
					}
				}
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
				$(".btn_submit").on("click", function(event) {
					var target = $(event.currentTarget);
					var fmObj = $('#ansForm');
					var fmData = fmObj.serializeArray();
					var usName = target.siblings("#userName");
					var phone = target.siblings("#userPhone");
					var guList = {};
					// console.log(fmData);
					if (fmData.length != gameCount) {
						_.userMsg = '亲，您还没有答完题哦，请滑动返回答题。';
						errorTip(); //错误提示
						return false;
					}
					var resDataArr = [];
					for (var i = 0; i < fmData.length; i++) {
						resDataArr.push(fmData[i].value);
					}
					guList['activityId'] = '20001'; //第X期竞猜
					guList['resultData'] = resDataArr.toString();
					guList['name'] = usName.val();
					guList['activityUserId'] = phone.val();
					guList['phone'] = phone.val();
					guList['objectId'] = dayNum; //第几天竞猜
					guList['deadline'] = deadlineNum + ' 23:59:59'; //截止时间
					// console.log({guessList:guList});
					if (!validateInfo(guList)) {
						errorTip(); //错误提示
						return false;
					}
					//防网络延迟重复提交
					var nowTime = new Date().getTime();
					var clickTime = $(this).attr("ctime");
					if (clickTime != 'undefined' && (nowTime - clickTime < 5000)) {
						_.userMsg = '操作过于频繁，稍后再试';
						errorTip(); //错误提示
						return false;
					} else {
						$(this).attr("ctime", nowTime);
					}
					//异步请求
					// var urlInfo=guessUrl+'/mlottery/core/activity.subGuessData.do';
					var urlInfo = guessUrl + '/mlottery/core/activity.addActivityData.do';
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

	//关闭浮层,开始答题
	$(".btn_close").on("click", function(event) {
		window.location.href = "./subject.html";
	});
	//返回
	$(".back").on("click", function(event) {
		window.location.href = "./index.html";
		document.body.scrollTop = 0; //回到顶部
	});
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
		var deadline = new Date(data.deadline); //截止时间
		var currTime = new Date(); //当前日期
		var reg = "[`~\\\\!@#\$%\^&\*\(\)_\+<>\?:\"{},\.\/;'\[\\]]";
		if (data.name.match(reg)) {
			_.userMsg = '用户名包含非法字符';
			return false;
		}
		if ($.trim(data.phone) == "" || $.trim(data.name) == "") {
			_.userMsg = '用户名或手机号不能为空';
			return false;
		}
		if (!data.phone.match(/1[34578]\d{9}(?=,|$)/g)) {
			_.userMsg = '请正确输入11位手机号';
			return false;
		}
		if (deadline.getTime() < currTime.getTime()) {
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
		url: guessUrl + '/active/act/dailyGuess/index.html',
		title: '欧洲杯 每日猜猜猜，答题享好礼',
		desc: '有竞猜，更精彩！',
		imgUrl: guessUrl + '/active/act/dailyGuess/img/wx_icon.jpg'
	}
	WxUtil.share("", shareParam);
})(Zepto);
