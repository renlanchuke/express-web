var process = require('child_process');

// process.exec('',function (error, stdout, stderr) {
//     if (error !== null) {
//       console.log('exec error: ' + error);
//     }
// });


var callfile = require('child_process'); 
var ip = '1.1.1.1';
var username = 'test';
var password = 'pwd';
var newpassword = 'newpwd';

callfile.execFile('./test.sh',['-H', ip, '-U', username, '-P', password],null,function (err, stdout, stderr) {
    if(err) console.log(err);

    //console.log(stdout.toString());
});