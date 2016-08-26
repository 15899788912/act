//--------------------------------------- 前方高能 慎入... ------------------------------------------------

function countDown(time, _dom) {
    console.log(time);
    var _time = time.replace(/-/g, "/");
    //倒計時
    var time_now_server, time_now_client, time_end, time_server_client, timerID;
    time_end = new Date(_time); //结束的时间
    time_end = time_end.getTime() - (2 * 60 * 60 * 1000);

    time_now_server = new Date(); //开始的时间  "2016-06-25 21:00"
    time_now_server = time_now_server.getTime();
    time_now_client = new Date();
    time_now_client = time_now_client.getTime();
    time_server_client = time_now_server - time_now_client;

    function show_time() {
        var timer = document.getElementById(_dom);
        var $timer = $(timer);
        if (!timer) {
            return;
        }
        var time_now, time_distance, str_time;
        var int_day, int_hour, int_minute, int_second;
        var time_now = new Date();
        time_now = time_now.getTime() + time_server_client;
        time_distance = time_end - time_now;
        if (time_distance > 0) {
            int_day = Math.floor(time_distance / 86400000)
            time_distance -= int_day * 86400000;
            int_hour = Math.floor(time_distance / 3600000)
            time_distance -= int_hour * 3600000;
            int_minute = Math.floor(time_distance / 60000)
            time_distance -= int_minute * 60000;
            int_second = Math.floor(time_distance / 1000)
            if (int_hour < 10)
                int_hour = "0" + int_hour;
            if (int_minute < 10)
                int_minute = "0" + int_minute;
            if (int_second < 10)
                int_second = "0" + int_second;

            if (int_hour == 0 && int_minute == 0 && int_second == 0) {
                if ($timer.parent(".game").attr("class").indexOf("gray") == -1) {
                    $timer.parent(".game").removeClass("gray").addClass("gray");
                }

                str_time = "竞猜结束";
            } else {
                int_hour = parseInt(int_hour) + parseInt(int_day * 24);
                str_time = int_hour + ":" + int_minute + ":" + int_second;
            }
            timer.innerHTML = str_time;
            setTimeout(show_time, 1000);
        } else {
            if ($timer.parent(".game").attr("class").indexOf("gray") == -1) {
                $timer.parent(".game").removeClass("gray").addClass("gray");
            }

            timer.innerHTML = "竞猜结束";
            clearTimeout(show_time);
        }
    }

    setTimeout(show_time, 1000);
}
