var common=require('./common.js');

var logger=common.logger;

var ip_address='192.168.3.12:7000';
exports.getOSDList=function (ip_address,callback){
    var url=ip_address+'/osd/list_data';

    common.get(url,null,function(err,data){
        if(err){
            logger.error("Error accur while get osd data list");
            return;
        }
        var jsonData=JSON.parse(data);
        logger.info("data: ",jsonData);
    });
}
