/**
 * Initialize the application based on configurations
 * 1. wipe out all collections
 * 2. init default user
 * 3. bootstrap data
 */
var appConfig = require('../config.js')();
var mongoose = require('mongoose');

require('../collections/user.js');



var User = mongoose.model('User');

// Connect to mongodb
var connect = function () {
    var conn = mongoose.connect(appConfig.database);
}
connect();

// Error handler
mongoose.connection.on('error', function (err) {
    console.log(err);
})


var defaultUser = {
    username: 'admin@gushenxing.com',
    name: 'Admin',
    role: 'admin',
    password: 'gushenxing123'
};


console.log(defaultUser);

// var promise = mongoose.model('Aggregation').remove({}).exec();

// promise.then(function () {
//     console.log('Aggregation data removed');
//     return mongoose.model('Agent').remove({}).exec();

// }).then(function () {
//     console.log('Agent data removed');
//     return mongoose.model('Asset').remove({}).exec();

// })


User.remove({}, function(err){
    if(!err){
        console.log('User data removed');
        User.register(new User(defaultUser), defaultUser.password, function(err1, user1) {
            if(err1){
                console.log(err1);
                mongoose.connection.close();
                process.exit(0);
            }else{
                console.log('Created user ' + user1.username  + ' with role ' + user1.role);
                mongoose.connection.close();
                process.exit(0);

            }
        });
    } else {
        console.log('Error removing User ');
        console.log(err);
        mongoose.connection.close();
        process.exit(0);
    }
});








