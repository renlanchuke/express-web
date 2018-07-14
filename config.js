var config = {
    development: {
        database: 'mongodb://127.0.0.1/deepsphere',
        // express server
        expressHttpPort: 3001
    },
    local: {
        database: 'mongodb://127.0.0.1/deepsphere',
        // express server
        expressHttpPort: 3001
    },
    production: {
        database: 'mongodb://127.0.0.1/deepsphere',
        // express server
        expressHttpPort: 3001
    }
};

var env = process.env.NODE_ENV || 'development';

module.exports = function(){
    var returnVal = config[env];
    return returnVal;
};
