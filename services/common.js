var self = require('./common');
var winston = require('winston');






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

