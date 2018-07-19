var self = require('./common');
var winston = require('winston');

var fs = require('fs');
var http = require("http");
var request = require('request');
var zlib = require('zlib');
var config = require("../config");
var self = require('./common');




//////////////////网络访问部分

var maxretry = 5;//请求如果出错的话，最大重试次数

//使用cookie访问页面
exports.get = function (url, cookie, callback, retry) {
    if (!retry) retry = 0;
    var headers = {
        'Accept': 'text/html, application/xhtml+xml, */*',
        'Accept-Language': 'zh-CN',
        'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip,deflate'

    };

    request({
        url: url,
        headers: headers,
        timeout: 5000,
        encoding: null
    },
        function (error, response, data) {
            // console.log("error: "+error);
            if (!error && response.statusCode == 200) {

                var buffer = new Buffer(data);
                var encoding = response.headers['content-encoding'];
                if (encoding == 'gzip') {
                    zlib.gunzip(buffer, function (err, decoded) {
                        //console.log("err: "+ err);
                        callback(err && ('unzip error' + err), decoded && decoded.toString());
                    });
                } else if (encoding == 'deflate') {
                    zlib.inflate(buffer, function (err, decoded) {
                        callback(err && ('deflate error' + err), decoded && decoded.toString());
                    })
                } else {

                    callback(null, buffer.toString());
                }
            }
            else {
                //小于错误次数则重试
                if (retry < maxretry) {
                    self.logger.warn("retry getting url : " + url);
                    setTimeout(function () {
                        self.get(url, cookie, callback, retry + 1);
                    }, 3000);

                }
                else
                    callback(error || response.statusCode);
            }
        });
}

//用form訪問
exports.post = function (url, form, callback, retry) {
    if (!retry) retry = 0;
    var header = {
        'Host': 'search.appledaily.com.tw',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Referer': 'http://search.appledaily.com.tw/appledaily/search',
        'Cookie': '__gads=ID=1d16a7619e04b96c:T=1474698703:S=ALNI_MaCy_qdMc9zcjAclzM-0Fl2x904Kg; _ga=GA1.3.1268670537.1474698703; _parsely_visitor={%22id%22:%222b73725c-55f7-45c9-ae66-530323a3fef0%22%2C%22session_count%22:4%2C%22last_session_ts%22:1474718566380}; ZP_CAL=%27fdow%27%3Anull%2C%27history%27%3A%222016/01/15/00/00%2C2015/12/14/00/00%22%2C%27sortOrder%27%3A%22asc%22%2C%27hsize%27%3A9; _parsely_session={%22sid%22:4%2C%22surl%22:%22http://www.appledaily.com.tw/appledaily/article/headline/20160924/37393667/applesearch/%25E8%2594%25A1%25EF%25BC%259A%25E9%25A3%259B%25E5%25AE%2589%25E4%25B8%258D%25E6%2587%2589%25E8%25A2%25AB%25E6%2594%25BF%25E6%25B2%25BB%25E4%25BB%258B%25E5%2585%25A5%22%2C%22sref%22:%22http://search.appledaily.com.tw/appledaily/search%22%2C%22sts%22:1474718566380%2C%22slts%22:1474714129813}; _gali=pageNumber',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    };

    request.post({
        url: url,
        header,
        form: form
        // headers: headers,
        // timeout: 15000,
        // encoding: null
    },
        function (error, response, data) {
            // console.log("error: "+error);
            if (!error && response.statusCode == 200) {

                var buffer = new Buffer(data);
                var encoding = response.headers['content-encoding'];
                if (encoding == 'gzip') {
                    zlib.gunzip(buffer, function (err, decoded) {
                        //console.log("err: "+ err);
                        callback(err && ('unzip error' + err), decoded && decoded.toString());
                    });
                } else if (encoding == 'deflate') {
                    zlib.inflate(buffer, function (err, decoded) {
                        callback(err && ('deflate error' + err), decoded && decoded.toString());
                    })
                } else {

                    callback(null, buffer.toString());
                }
            }
            else {
                //小于错误次数则重试
                if (retry < 3) {
                    logger.log("retry getting url : " + url);
                    setTimeout(function () {
                        self.getContent(url, form, callback, retry + 1);
                    }, 3000);

                }
                else
                    callback(error || response.statusCode);
            }
        });
}





//时间格式化输出
exports.getDateString = function (date) {
    if (!date) {
        date = new Date();
    }
    var year = date.getFullYear().toString();
    var month = date.getMonth().toString();
    var day = date.getDate().toString();
    var hour=date.getHours().toString();
    var min=date.getMinutes().toString();

    return year + '-' + month + '-' + day + ' ' + hour + ':' + min;
}

//生成两个日期中连续的以天为间隔的日期
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
//date日期格式yyyy-MM-dd
exports.getDateArray = function (date1, date2) {
    var dateTem1 = new Date();
    var dateTem2 = new Date();
    var dateArr1 = date1.split('-')
    var dateArr2 = date2.split('-')

    dateTem1.setFullYear(parseInt(dateArr1[0]), parseInt(dateArr1[1]) - 1, parseInt(dateArr1[2]));
    dateTem2.setFullYear(parseInt(dateArr2[0]), parseInt(dateArr2[1]) - 1, parseInt(dateArr2[2]));

    var results = [];
    while (dateTem1 <= dateTem2) {

        results.push(dateTem1.format("yyyy-MM-dd"))
        dateTem1.setDate(dateTem1.getDate() + 1);
        //console.log(dateRem.format("yyyy-MM-dd"));
    }

    return results
}


exports.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return self.getDateString();
      },
      formatter: function(options) {
        // Return string will be passed to logger.
        return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    })
  ]
});

