/**
 * @method timer
 * @for timeUtil
 * @param {object} args
 *						_dom:DOM的ID ,必填
 *						endTime:结束时间 ,必填
 *						startTime:开始时间 ,选填
 *   					时间格式（2016-06-25 21:00:00）年月日必填，时秒分选填
 * @return {null}
 */
window.timeUtil = (function(window, document) {
    return {
        timer: function(args) {
            var _dom = args._dom; //ID dom
            var endTime = args.endTime; //结束时间
            var startTime = args.startTime; //开始时间

            var _time = endTime.replace(/-/g, "/"); //兼容ios，时间需要格式化
            //倒計時
            var time_now_server, time_now_client, time_end, time_server_client, timerID;
            time_end = new Date(_time);
            time_end = time_end.getTime();

            time_now_server = startTime === undefined ? new Date() : new Date(startTime);

            time_now_server = time_now_server.getTime();
            time_now_client = new Date();
            time_now_client = time_now_client.getTime();
            time_server_client = time_now_server - time_now_client;

            function show_time() {
                var timer = document.getElementById(_dom);
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
                    str_time = int_hour + ':' + int_minute + ':' + int_second;
                    timer.innerHTML = str_time;
                    setTimeout(show_time, 1000);
                } else {
                    clearTimeout(show_time);
                }
            }


            setInterval(show_time, 1000);
        }

    }
})(window, document);
