var ssl = true;

if(process.argv.length > 2){
    if(process.argv[2] == 'nossl'){
        ssl = false;
    }
}
if(ssl){
    console.log("Running DeepSphere in SSL mode");
}else{
    console.log("Running DeepSphere in NONE-SSL mode");
}

var expressServer = require('./services/expressServer.js');


// start express server
expressServer.onAppStart(ssl);
