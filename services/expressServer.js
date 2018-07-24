// app require
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer'); // handling multipart/form-data, which is primarily used for uploading files
var errorHandler = require('errorhandler');
var ConnectRoles = require('connect-roles');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// local require
var config = require('../config.js')();
var routes = require('../routes/index.js');

var logger = require('./common').logger



// fixed mongoose event memory leak: https://github.com/Automattic/mongoose/issues/1992
mongoose.Promise = global.Promise;



// api authentication
var apiUseAuthentication = function (req, res, next) {

    function unauthorized(res) {
        return res.json({
            data: {},
            code: 3,
            message: "No Authentication"
        });
    };

    if (!req.user) {
        return unauthorized(res);
    } else {
        next();
    }

};

var apiNoAuthentication = function (req, res, next) {
    logger.debug("req.body: " + JSON.stringify(req.body));
    req.user = {
        username: 'admin@gushenxing.com',
        name: 'Admin',
        role: 'admin'
    };
    next();
};

var initApp = function (app, ssl) {

    // api authentication
    var apiAuthentication = apiNoAuthentication;
    if (ssl) {
        apiAuthentication = apiUseAuthentication;
    }

    // passport config
    var User = require('../collections/user');
    passport.use(new LocalStrategy(User.authenticate()));


    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.set('port', process.env.PORT || config.expressHttpPort);
    app.set('views', path.join(__dirname, '/../views'));
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(methodOverride());
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: 'uwotm8'
    }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, '/../public')));
    app.use(morgan('combined', {
        skip: function (req, res) {
            return res.statusCode < 400
        }
    }));


    if (ssl) {
        app.use(passport.initialize());
        app.use(passport.session());
        // user role authorization
        var user = new ConnectRoles({
            failureHandler: function (req, res, action) {
                // optional function to customise code that runs when
                // user fails authorisation
                res.status(403);
                res.send('Access Denied - You don\'t have permission to: ' + action);
            }
        });

        app.use(user.middleware());

        user.use('upgrade', function (req) {
            if (req.user) {
                return service.isAuthorized(req.user.role, 'upgrade');
            }
        })

        //admin users can access all pages
        user.use(function (req) {
            if (req.user) {
                if (req.user.role === 'admin') {
                    return true;
                }
            }

        });
    }


    // development env
    if (app.get('env') === 'development') {
        logger.level = 'debug';
        logger.debug('running in development env');
        app.use(errorHandler({ dumpExceptions: true, showStack: true }));
    }
    ;

    // production only
    if (app.get('env') === 'production') {
        logger.debug('running in production env');
        app.use(errorHandler());
    }

    const router = express.Router();

    //设置跨域访问

    app.use('/', require('../routes/index.js'));
    app.use('/api/ceph', apiAuthentication, require('../routes/cephRouter.js'));
    app.use('/api/rack', apiAuthentication, require('../routes/rackRouter.js'))

}


var onAppStart = function (ssl) {

    // Connect to mongodb
    var connect = function () {
        var options = {
            server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
        };
        var conn = mongoose.connect(config.database, options);
    };
    connect();

    // mongoose error handler
    mongoose.connection.on('error', function (err) {
        logger.error(err);
    });

    // mongoose reconnect when closed
    mongoose.connection.on('disconnected', function () {
        connect();
    });



    // express server
    var app = express();

    initApp(app, ssl);

    var server = http.Server(app);

    // Hook Socket.io into Express
    //var io = require('socket.io')(server);
    // Socket.io Communication
    //io.on('connection', socket.socketOnConnect);
    // start server
    server.listen(app.get('port'), function () {
        logger.info('server listening on port ' + app.get('port') + ' @' + app.get('env'));
    });
}


exports.onAppStart = onAppStart;



