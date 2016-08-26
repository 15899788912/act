/*猜阵容*/
(function($) {
    var _ = this;
    var mySwiper;
    var guUrlObj = {
        "desktop": "http://192.168.10.242:8181",
        "development": "http://m.1332255.com",
        "production": "http://m.13322.com"
    }
    var gjMap = {
        "1": ["icon-qfg", "法国"],
        "2": ["icon-qlmny", "罗马尼亚"],
        "3": ["icon-qaebny", "阿尔巴尼亚"],
        "4": ["icon-qrs", "瑞士"],
        "5": ["icon-qygl", "英格兰"],
        "6": ["icon-qels", "俄罗斯"],
        "7": ["icon-qwes", "威尔士"],
        "8": ["icon-qslfk", "斯洛伐克"],
        "9": ["icon-qdg", "德国"],
        "10": ["icon-qwkl", "乌克兰"],
        "11": ["icon-qbolan", "波兰"],
        "12": ["icon-qbael", "北爱尔兰"],
        "13": ["icon-qxby", "西班牙"],
        "14": ["icon-qjk", "捷克"],
        "15": ["icon-qteq", "土耳其"],
        "16": ["icon-qkldy", "克罗地亚"],
        "17": ["icon-qbls", "比利时"],
        "18": ["icon-qydl", "意大利"],
        "19": ["icon-qael", "爱尔兰"],
        "20": ["icon-qrd", "瑞典"],
        "21": ["icon-qpty", "葡萄牙"],
        "22": ["icon-qbd", "冰岛"],
        "23": ["icon-qadl", "奥地利"],
        "24": ["icon-qxyl", "匈牙利"]
    }

    //比赛日
    var bsDate = {
        "_25": "14",
        "_26": "15",
        "_27": "16",
        "_30": "17",
        "_1": "18",
        "_2": "19",
        "_3": "20",
        "_6": "21",
        "_7": "22",
        "_10": "23"
    }

    //打开详情
    $(".open_details").click(function() {
        open_detail();
    });

    //关闭浮层
    $(".btn_close").on("click", function(event) {
        close_detail();
    });

    //跳转查询
    $(".select").click(function() {
        window.location.href = "result.html";
    });

    function open_detail() {
        $(".details").show();
        $("body").addClass('hidden_overflow');
    }

    function close_detail() {
        $(".details").hide();
        $("body").removeClass("hidden_overflow");
    }

    //再次参加活动
    $(".again-click").click(function() {
        window.location.href = "index.html";
    });

    //按页面加载请求数据
    var _page = $("#_page").val();
    switch (_page) {
        case '1':
            getMatch();
            break;
        case '2':
            getTeams();
            break;
        case '3':
            getPage3();
            break;
        case '4':
            getShowTeam();
            break;

    }

    //獲取比賽信息
    function getMatch() {
        var newDate = new Date();
        switch (newDate.getDate() + "") {
            case '25':
                writeBSDate(bsDate._25);
                break;
            case '26':
                writeBSDate(bsDate._26);
                break;
            case '27':
                writeBSDate(bsDate._27);
                break;
            case '28':
                writeBSDate(bsDate._30);
                break;
            case '29':
                writeBSDate(bsDate._30);
                break;
            case '30':
                writeBSDate(bsDate._30);
                break;
            case '1':
                writeBSDate(bsDate._1);
                break;
            case '2':
                writeBSDate(bsDate._2);
                break;
            case '3':
                writeBSDate(bsDate._3);
                break;
            case '4':
                writeBSDate(bsDate._6);
                break;
            case '5':
                writeBSDate(bsDate._6);
                break;
            case '6':
                writeBSDate(bsDate._6);
                break;
            case '7':
                writeBSDate(bsDate._7);
                break;
            case '8':
                writeBSDate(bsDate._10);
                break;
            case '9':
                writeBSDate(bsDate._10);
                break;
            case '10':
                writeBSDate(bsDate._10);
                break;
            default:
                writeBSDate('14');
        }

        //异步请求
        var urlInfo = guUrlObj["production"] + '/mlottery/core/activity.findCurMatch.do';
        $.ajax({
            type: 'POST',
            url: urlInfo,
            data: {},
            beforeSend: function() {
                $("#J_Mask").show();
            }, //loading
            timeout: 5000,
            success: function(data) {
                if (data.result === 200) {
                    writeMatch(data.data);
                }

            },
            error: function(xhr, errorType, error) {
                _.userMsg = '请检查网络...';
                errorTip(); //错误提示
            },
            complete: function() {
                    $("#J_Mask").hide();
                } //隐藏loading
        });
    }

    function writeBSDate(_date) {
        $(".zi-show span").html(_date);
    }

    function writeMatch(data) {
        var _data = "",
            status = "",
            matchTime = [],
            obj = data.matches;

        for (var i = 0, length = obj.length; i < length; i++) {
            var homeIcon = "",
                guestIcon = "";

            if (obj[i].status === -1) { //-1未开场
                status = "gray";
            } else {
                status = "";
            }
            homeIcon = gjMap[obj[i].homeTeamId][0];
            guestIcon = gjMap[obj[i].guestTeamId][0];

            matchTime.push(obj[i].matchTime);

            _data += "<div class='game " + status + "'><input type='hidden' class='matchId' value='" + obj[i].matchId + "' /><div class='game-vs'><div class='flag'><div class='" + homeIcon + "' id='homeIcon'></div><span class='homeTeam'>" + obj[i].homeTeam + "</span></div><div class='flag-vs'><img src='@@ROOT/act/guessArray/img/vs.png' /><span>离竞猜截止时间：</span></div><div class='flag'><div class='" + guestIcon + "' id='guestIcon'></div><span class='guestTeam'>" + obj[i].guestTeam + "</span></div></div><div class='time' id='timer" + i + "'></div><div class='clear' style='clear: both;'></div><input type='hidden' value='" + obj[i].property + "' id='_property'/><input type='hidden' value='" + obj[i].matchTime + "' id='_matchTime'/><input type='hidden' value='" + obj[i].place + "' id='_place'/></div>";
            countDown(matchTime[i], "timer" + i);
        }
        $(".games").html(_data);

        clickLoadPage2();
    }

    function clickLoadPage2() {
        $(".game").click(function() {
            var _status = $(this);
            if (_status.attr("class").indexOf("gray") > 0) {
                _.userMsg = "该赛事已结束。";
                errorTip();
            } else {
                var _matchId = _status.find(".matchId").val();
                var homeTeam = _status.find(".homeTeam").text();
                var guestTeam = _status.find(".guestTeam").text();
                var _property = _status.find("#_property").val();
                var _matchTime = _status.find("#_matchTime").val();
                var _place = _status.find("#_place").val();
                var _homeIcon = _status.find("#homeIcon").attr("class");
                var _guestIcon = _status.find("#guestIcon").attr("class");
                var _teams = {
                    'homeTeam': {
                        'name': homeTeam,
                        'icon': _homeIcon
                    },
                    'guestTeam': {
                        'name': guestTeam,
                        'icon': _guestIcon
                    },
                    'place': _place,
                    'property': _property,
                    'matchTime': _matchTime
                }
                sessionStorage.setItem("_teams", JSON.stringify(_teams));
                sessionStorage.setItem("local", true); //仅用于判断是否正常跳转
                window.location.href = "page2.html?matchId=" + _matchId;
            }

        });
    }

    //获取球员信息
    function getTeams() {
        var _teams = JSON.parse(sessionStorage.getItem("_teams"));
        var _local = sessionStorage.getItem("local");
        if (!_local) {
            window.location.href = "index.html";
        }

        $(".homeTeam").html(_teams.homeTeam.name);
        $(".guestTeam").html(_teams.guestTeam.name);
        $(".arrayTeam-1 .qi-img").removeClass().addClass("qi-img").addClass(_teams.homeTeam.icon);
        $(".arrayTeam-1 .qi-img").append("<input type='hidden' value='" + _teams.homeTeam.icon + "' />");
        $(".arrayTeam-2 .qi-img").removeClass().addClass("qi-img").addClass(_teams.guestTeam.icon);
        $(".arrayTeam-2 .qi-img").append("<input type='hidden' value='" + _teams.guestTeam.icon + "' />");
        var matchId = getQueryString("matchId");
        sessionStorage.setItem("matchId", matchId);
        var params = {
            'matchId': matchId
        };
        var urlInfo = guUrlObj["production"] + '/mlottery/core/activity.findPlayerByMatchId.do';
        $.ajax({
            type: 'POST',
            url: urlInfo,
            data: params,
            beforeSend: function() {
                $("#J_Mask").show();
            }, //loading
            timeout: 5000,
            success: function(data) {
                if (data.result === 200) {
                    writeTeams(data.data);
                }
            },
            error: function(xhr, errorType, error) {
                _.userMsg = '请检查网络...';
                errorTip(); //错误提示
            },
            complete: function() {
                    $("#J_Mask").hide();
                } //隐藏loading
        });

    }

    function writeTeams(data) {
        //init球队信息
        chooseWriteTeams(data);

        //随机排阵
        randomTeam(data);

        //选择球队
        $(".flag-hand").click(function() {
            _qiname = $(this).find(".qi-name");
            _icon = $(this).find(".qi-img").find("input").val();
            _imgs1 = [];
            _imgs2 = [];

            if (_qiname.attr("class").indexOf("homeTeam") > 0) {
                //判断球员未选中所有人数 禁止切换
                var imgs2 = $(".arrayTeam-2 .team-person img");
                for (var i = 0, length = imgs2.length; i < length; i++) {
                    if ($(imgs2[i]).attr("src") !== '@@ROOT/act/guessArray/img/person.png') {
                        _imgs2.push($(imgs2[i]).attr("src"));
                    }

                }
                if (_imgs2.length !== 0 && _imgs2.length !== 11) {
                    _.userMsg = "您未选满首发11人";
                    errorTip();
                    return;
                }

                chooseTeams(data.homeTeam, _qiname.text(), _icon);
                $(".arrayTeam-1 .team-person img").attr("src", "@@ROOT/act/guessArray/img/person.png");
                $(".arrayTeam-1 .team-person img").find(".id").remove();
                sessionStorage.setItem("chooseTeam", 'homeTeam');
            }
            if (_qiname.attr("class").indexOf("guestTeam") > 0) {
                var imgs1 = $(".arrayTeam-1 .team-person img");
                for (var i = 0, length = imgs1.length; i < length; i++) {
                    if ($(imgs1[i]).attr("src") !== '@@ROOT/act/guessArray/img/person.png') {
                        _imgs1.push($(imgs1[i]).attr("src"));
                    }

                }
                if (_imgs1.length !== 0 && _imgs1.length !== 11) {
                    _.userMsg = "您未选满首发11人";
                    errorTip();
                    return;
                }

                chooseTeams(data.guestTeam, _qiname.text(), _icon);
                $(".arrayTeam-2 .team-person img").attr("src", "@@ROOT/act/guessArray/img/person.png");
                $(".arrayTeam-2 .team-person img").find(".id").remove();
                sessionStorage.setItem("chooseTeam", 'guestTeam');
            }

        });
    }

    function chooseWriteTeams(data) {
        var _teams = JSON.parse(sessionStorage.getItem("_teams"));
        var _qiname = _teams.homeTeam.name;
        var _icon = _teams.homeTeam.icon;

        var _imgs1 = [],
            _imgs2 = [];
        //默认球队
        var imgs2 = $(".arrayTeam-2 .team-person img");
        for (var i = 0, length = imgs2.length; i < length; i++) {
            if ($(imgs2[i]).attr("src") !== '@@ROOT/act/guessArray/img/person.png') {
                _imgs2.push($(imgs2[i]).attr("src"));
            }

        }
        if (_imgs2.length !== 0 && _imgs2.length !== 11) {
            _.userMsg = "您未选满首发11人";
            errorTip();
            return;
        }
        chooseTeams(data.homeTeam, _qiname, _icon);
        $(".arrayTeam-1 .team-person img").attr("src", "@@ROOT/act/guessArray/img/person.png");
        $(".arrayTeam-1 .team-person img").find(".id").remove();
        sessionStorage.setItem("chooseTeam", 'homeTeam');
    }

    function chooseTeams(data, name, _icon) {
        var _persons = "";
        for (var i = 0, length = data.length; i < length; i++) {
            _persons += "<li><img src='" + data[i].iMAGE + "' /><input type='hidden' value='" + data[i].id + "' /></li>";
        }
        _persons += "<div class='clear'></div>";
        $("#choose_name").html(name);
        $("#choose_persons ul").html(_persons);
        $(".choosePerson .flag div").removeClass().addClass(_icon);

        choosePerson();
        removePerson();
    }

    function choosePerson() {
        $("#choose_persons ul li img").click(function() {
            var chooseTeam = sessionStorage.getItem("chooseTeam");
            var _id = $(this).next().val();
            var downImgs = $("#choose_persons ul li img");
            if (chooseTeam === 'homeTeam') {
                var persons_img = $(".arrayTeam-1 .team-person img");
                for (var j = 0, length = persons_img.length; j < length; j++) {
                    if ($(persons_img[j]).attr("src") === "@@ROOT/act/guessArray/img/person.png") {
                        $(persons_img[j]).attr("src", $(this).attr("src"));
                        $(persons_img[j]).append("<input type='hidden' class='id' value='" + _id + "' />");
                        $(this).parent().remove();
                        break;
                    }

                }
            } else {
                var persons_img = $(".arrayTeam-2 .team-person img");
                for (var j = 0, length = persons_img.length; j < length; j++) {
                    if ($(persons_img[j]).attr("src") === "@@ROOT/act/guessArray/img/person.png") {
                        $(persons_img[j]).attr("src", $(this).attr("src"));
                        $(persons_img[j]).append("<input type='hidden' class='id' value='" + _id + "' />");
                        $(this).parent().remove();
                        break;
                    }
                }
            }

        });

    }

    function removePerson() {
        $(".team-person img").click(function() {
            var _person = $(this);
            var chooseTeam = sessionStorage.getItem("chooseTeam");
            var teamType = _person.parents(".team-person").parent(); //球队类型
            if (_person.attr("src") !== '@@ROOT/act/guessArray/img/person.png') {
                if ((teamType.attr("class").indexOf("arrayTeam-1") > -1) && chooseTeam === 'homeTeam') {
                    $("#choose_persons ul .clear").before("<li><img src='" + _person.attr("src") + "' /><input type='hidden' value='" + _person.find(".id").val() + "' /></li>");
                }
                if ((teamType.attr("class").indexOf("arrayTeam-2") > -1) && chooseTeam === 'guestTeam') {
                    $("#choose_persons ul .clear").before("<li><img src='" + _person.attr("src") + "' /><input type='hidden' value='" + _person.find(".id").val() + "' /></li>");
                }
                _person.attr("src", "@@ROOT/act/guessArray/img/person.png");
                _person.find(".id").remove();

            }

            resetPersons();

        });

    }
    //重置选择球员
    function resetPersons() {
        $("#choose_persons ul li img").unbind("click");

        $("#choose_persons ul li img").click(function() {
            var chooseTeam = sessionStorage.getItem("chooseTeam");
            var _id = $(this).next().val();
            var downImgs = $("#choose_persons ul li img");
            if (chooseTeam === 'homeTeam') {
                var persons_img = $(".arrayTeam-1 .team-person img");
                for (var j = 0, length = persons_img.length; j < length; j++) {
                    if ($(persons_img[j]).attr("src") === "@@ROOT/act/guessArray/img/person.png") {
                        $(persons_img[j]).attr("src", $(this).attr("src"));
                        $(persons_img[j]).append("<input type='hidden' class='id' value='" + _id + "' />");
                        $(this).parent().remove();
                        break;
                    }

                }
            } else {
                var persons_img = $(".arrayTeam-2 .team-person img");
                for (var j = 0, length = persons_img.length; j < length; j++) {
                    if ($(persons_img[j]).attr("src") === "@@ROOT/act/guessArray/img/person.png") {
                        $(persons_img[j]).attr("src", $(this).attr("src"));
                        $(persons_img[j]).append("<input type='hidden' class='id' value='" + _id + "' />");
                        $(this).parent().remove();
                        break;
                    }
                }
            }

        });

    }

    //随机排阵
    function randomTeam(data) {
        $(".suiji-img").click(function() {
            //清空队列
            sessionStorage.removeItem("chooseTeam"); //移除默认球队
            $(".arrayTeam-3 .flag div").removeClass();
            $("#choose_name").html("");
            $('#choose_persons ul').html("");

            //随机组合
            var _homeTeam = [];
            var _guestTeam = [];
            var rands = []; //随机数组
            rands = randomArray();

            for (var k = 0; k < rands.length; k++) {
                _homeTeam.push(data.homeTeam[rands[k]]);
            }
            console.log(_homeTeam)

            rands = randomArray();
            for (var k = 0; k < rands.length; k++) {
                _guestTeam.push(data.guestTeam[rands[k]]);
            }
            console.log(_guestTeam)

            var _homePersons = $(".arrayTeam-1 .team-person img");
            for (var j = 0, length = _homePersons.length; j < length; j++) {
                $(_homePersons[j]).attr("src", _homeTeam[j].iMAGE);
                $(_homePersons[j]).html("").append("<input type='hidden' class='id' value='" + _homeTeam[j].id + "' />");
            }
            var _guestPersons = $(".arrayTeam-2 .team-person img");
            for (var j = 0, length = _guestPersons.length; j < length; j++) {
                $(_guestPersons[j]).attr("src", _guestTeam[j].iMAGE);
                $(_guestPersons[j]).html("").append("<input type='hidden' class='id' value='" + _guestTeam[j].id + "' />");
            }

        });

    }

    //生成随机数组
    function randomArray() {
        var rands = []; //随机数组
        for (var i = 0; i < 11; i++) {
            var val = Math.ceil(Math.random() * 22);
            var isEqu = false;
            for (var j in rands) {
                if (rands[j] == val) {
                    isEqu = true;
                    break;
                }
            }
            if (isEqu)
                i--;
            else
                rands[rands.length] = val;
        }
        return rands;
    }

    //获取提交数据
    $(".zi-img").click(function() {
        sessionStorage.setItem("local", true);
        var ids1 = $(".arrayTeam-1 .id");
        var ids2 = $(".arrayTeam-2 .id");
        var imgs1 = $(".arrayTeam-1 .team-person img");
        var imgs2 = $(".arrayTeam-2 .team-person img");
        var _ids1 = [],
            _ids2 = [],
            _imgs1 = [],
            _imgs2 = [],
            _obj = {};

        var _teams = JSON.parse(sessionStorage.getItem("_teams"));
        for (var i = 0, length = ids1.length; i < length; i++) {
            _ids1.push($(ids1[i]).val());
        }
        for (var i = 0, length = ids2.length; i < length; i++) {
            _ids2.push($(ids2[i]).val());
        }
        for (var i = 0, length = imgs1.length; i < length; i++) {
            if ($(imgs1[i]).attr("src") !== '@@ROOT/act/guessArray/img/person.png') {
                _imgs1.push($(imgs1[i]).attr("src"));
            }

        }
        for (var i = 0, length = imgs2.length; i < length; i++) {
            if ($(imgs2[i]).attr("src") !== '@@ROOT/act/guessArray/img/person.png') {
                _imgs2.push($(imgs2[i]).attr("src"));
            }
        }

        var newIds1 = arrSort(_ids1); //判断去重
        var newIds2 = arrSort(_ids2);

        if (newIds1.length !== 11 || newIds2.length !== 11) {
            _.userMsg = "您未选满首发11人";
            errorTip();
        } else {
            _teams.homeTeam['team'] = newIds1;
            _teams.guestTeam['team'] = newIds2;
            _teams.homeTeam['imgs'] = _imgs1;
            _teams.guestTeam['imgs'] = _imgs2;
            sessionStorage.setItem("_teams", JSON.stringify(_teams));
            window.location.href = "page3.html";
        }

    });

    function getPage3() {
        var _local = sessionStorage.getItem("local");
        if (!_local) {
            window.location.href = "index.html";
        }
    }

    $(".btn_submit").click(function() {
        addActive();
    });

    //提交活动
    function addActive() {
        var phone = $("#userPhone").val();
        var usName = $("#userName").val();
        var matchId = sessionStorage.getItem("matchId");
        var valData = {
            'phoneVal': phone,
            'usNameVal': usName.replace(/[ ]/g, "")
        };
        if (!validateInfo(valData)) {
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
        var _data = sessionStorage.getItem("_teams");
        var urlInfo = guUrlObj["production"] + '/mlottery/core/activity.addGuessTeamData.do';
        console.log(usName.replace(/[ ]/g, ""));
        $.ajax({
            type: 'POST',
            url: urlInfo,
            data: {
                'activityId': '10002',
                'activityUserId': phone,
                'phone': phone,
                'name': usName.replace(/[ ]/g, ""),
                'resultData': _data,
                'objectId': matchId
            },
            beforeSend: function() {
                $("#J_Mask").show();
            }, //loading
            timeout: 5000,
            success: function(data) {
                console.log(JSON.stringify(data))
                switch (data.result) {
                    case 200:
                        sessionStorage.setItem("local", "3");
                        window.location.href = 'page4.html?activityUserId=' + data.data.activityUserId + '&objectId=' + matchId;
                        break;
                    case 500:
                        _.userMsg = '系统错误';
                        errorTip();
                        break;
                    case 1005:
                        _.userMsg = '您已经参与过了';
                        errorTip();
                        break;
                    case 1041:
                        _.userMsg = '活动已过期';
                        errorTip();
                        break;
                    default:
                        _.userMsg = '未获取到相关数据';
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

    }

    //获取分享信息
    function getShowTeam() {
        var _activityUserId = getQueryString("activityUserId");
        var _objectId = getQueryString("objectId");

        var urlInfo = guUrlObj["production"] + '/mlottery/core/activity.findActivityData.do';
        $.ajax({
            type: 'POST',
            url: urlInfo,
            data: {
                'activityId': '10002',
                'activityUserId': _activityUserId,
                'objectId': _objectId
            },
            beforeSend: function() {
                $("#J_Mask").show();
            }, //loading
            timeout: 5000,
            success: function(data) {
                console.log(data);
                switch (data.result) {
                    case 200:
                        showTeam(data.data);
                        break;
                    case 500:
                        _.userMsg = '系统错误';
                        errorTip();
                        break;
                    case 1041:
                        _.userMsg = '活动已过期';
                        errorTip();
                        break;
                    default:
                        _.userMsg = '未获取到相关数据';
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
    }

    //显示队员信息
    function showTeam(data) {
        var _local = sessionStorage.getItem("local");
        var _data = JSON.parse(data.resultData);
        var _imgs1 = _data.homeTeam.imgs;
        var _icon1 = _data.homeTeam.icon;
        var imgs1 = $(".arrayTeam-1 .team-person img");
        var _imgs2 = _data.guestTeam.imgs;
        var _icon2 = _data.guestTeam.icon;
        var imgs2 = $(".arrayTeam-2 .team-person img");
        var _name1 = _data.homeTeam.name;
        var _name2 = _data.guestTeam.name;
        var _place = _data.place;
        var _property = _data.property;
        var _matchTime = _data.matchTime;

        for (var i = 0, length = _imgs1.length; i < length; i++) {
            $(imgs1[i]).attr("src", _imgs1[i]);
        }
        for (var i = 0, length = _imgs2.length; i < length; i++) {
            $(imgs2[i]).attr("src", _imgs2[i]);
        }
        $(".arrayTeam-1 .qi-name").html(_name1);
        $(".arrayTeam-2 .qi-name").html(_name2);

        $(".arrayTeam-1 .qi-img").removeClass().addClass(_icon1);
        $(".arrayTeam-2 .qi-img").removeClass().addClass(_icon2);

        $("#_matchTime").html(_matchTime);
        $("#_property").html(_property);
        $("#_place").html(_place);
        $("#_vs").html(_name1 + "&nbsp;vs&nbsp;" + _name2);

        //判断是否从分享入口进来
        if (_local === "3") {
            $(".again").hide();
            if (mobileUtil.isWeixin) {
                setTimeout(function() {
                    $(".share-img").addClass("fadeIn_show").show();
                    $(".share-img").click(function() {
                        $(this).hide();
                    });
                }, 4500);
            }
        }

    }

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
        var deadline = new Date('2016-5-29 01:00:00'); //截止时间
        var currTime = new Date(); //当前日期
        var reg = "[`~\\\\!@#\$%\^&\*\(\)_\+<>\?:\"{},\.\/;'\[\\]]";
        if (data.usNameVal.match(reg)) {
            _.userMsg = '用户名包含非法字符';
            return false;
        }
        if ($.trim(data.phoneVal) == "" || $.trim(data.usNameVal) == "") {
            _.userMsg = '用户名或手机号不能为空';
            return false;
        }
        if (!data.phoneVal.match(/1[34578]\d{9}(?=,|$)/g)) {
            _.userMsg = '请正确输入11位手机号';
            return false;
        }
        //		if (deadline.getTime() < currTime.getTime()) {
        //			_.userMsg = '活动已结束';
        //			setTimeout(function() {
        //				$('.ans_contain').hide();
        //				$(".foc_contain").show();
        //			}, 2000);
        //			return false;
        //		}
        return true;
    }

    //获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    //数据去重
    function arrSort(_this) {
        var n = [];
        for (var i = 0; i < _this.length; i++) {
            if (n.indexOf(_this[i]) == -1) n.push(_this[i]);
        }
        return n;
    }

    //微信分享
    var shareParam = {
        url: window.location.href,
        desc: '我来当主帅，有奖排首发. 快来挑战现金大奖吧！',
        title: '我来当主帅，有奖排首发. 快来挑战现金大奖吧！',
        imgUrl: guUrlObj["production"] + '/active/act/guessArray/img/share-icon.png'
    }
    WxUtil.share("", shareParam);

})(Zepto);
