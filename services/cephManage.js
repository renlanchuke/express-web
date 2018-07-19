var logger = require('./common.js').logger;
var sshClient = require('./sshClient.js');

/**
 * get all disks from the remote server
 * @param {*} ip 
 * @param {*} callback 
 */
exports.getServerDisks = function (ip, callback) {
    let loginInfo = {
        host: ip,
        port: 22,
        username: 'gushenxing',
        password: 'gushenxing123'
    };

    sshClient.remoteExec(loginInfo,"sudo fdisk -l",function(err,data,errData){
        let arr=new Array();
        let result=[];
        if(err) callback(err);
        if(data){
            arr=data.split("\n");
            for(let i=0;i<arr.length;i++){
                if(arr[i].indexOf("Disk /")!==-1)
                result.push(arr[i])    
            }
            callback(null,data);
            //console.log(result.toString());
        }

        if(errData){
            callback(null,null,errData)
        }
    });

}