var _ = require("underscore");
var fs = require('fs');
var _ = require("underscore");
var logger = require('winston');








/** users **/
exports.createUser = function(req, res){

    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;

    service.createUser(username, password, role, function(err, user){
        if(err || !user){
            res.json({
                error: 'USERNAME_EXISTS'
            });
        } else {
            res.json({
                data: user
            });
        }
    })

};


exports.changePassword = function(req, res){

    var username = req.body.username;
    var password = req.body.password;

    service.changePassword(username, password, function(err, user){
        if(err){
            res.json({
                error: 'ERROR'
            });
        } else {
            res.json({
                data: user
            });
        }

    })

};

exports.isAuthorized = function(req, res) {
    var authorized = false;
    var action = req.params.page;
    var user = req.user;
    if(user){
        var role = user.role;
        authorized = service.isAuthorized(role, action);
    }
    res.json(authorized);
};


exports.getUser = function(req, res) {
    var username = req.params.username;
    service.getUser(username, function(user){
        res.json({
            data: user
        });
    }, function(err){
        logger.error(err);
        res.status(500).send(err);
    })
};

exports.getUsers = function(req, res) {
    service.getUsers(function(users){
        res.json({
            data: users
        });
    }, function(err){
        logger.error(err);
        res.status(500).send(err);
    })
};

exports.updateUserProfile = function(req, res) {
    var user = req.body;
    service.updateUserProfile(user, function(user){
        res.json({
            data: user
        });
    }, function(err){
        logger.error(err);
        res.status(500).send(err);
    })
};

exports.updateUserProfiles = function(req, res) {
    var users = req.body;
    service.updateUserProfiles(users, function(user){
        res.json({
            data: user
        });
    }, function(err){
        logger.error(err);
        res.status(500).send(err);
    })
};

exports.validateUsername = function(req, res) {
    var data = req.body;
    var username = data.value;
    service.getUser(username, function(user){
        if(user && user.username){
            res.json({
                isValid: false, //Is the value received valid
                value: username //value received from server
            });
        } else {
            res.json({
                isValid: true, //Is the value received valid
                value: username //value received from server
            });
        }
    }, function(err){
        res.json({
            isValid: true, //Is the value received valid
            value: username //value received from server
        });
    })
};

