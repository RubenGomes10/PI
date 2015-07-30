/**
 * Created by Rúben Gomes on 27-07-2015.
 */
var pgSql  = require('../public/javascripts/pgSql'), // To access the database
    errors = require('../public/javascripts/errors');



var usersDB = {
    getAllUsers: function(done){
        pgSql.select('_user', null,function(err,users){
            if(err) return done(new errors.SqlError(err));
            done(null,users);
        });
    },
    getUserByUserName: function(username,done) {
        pgSql.select('_user', {username: username}, function (err, user) {
            if (err) return done(new errors.SqlError(err));
            done(null, user);
        })
    },
    getResponseFromUser: function(username,done){
        usersDB.getUserByUserName(username,function(err,user){
            if(err) return done(err);
            done(null,user.response);
        })
    },
    insertUser : function(username, password,email, firstname, lastname, question, response, done){
        pgSql.insertUser(username,password,email,firstname,lastname,question,response,function(err){
            if(err) return done(new errors.SqlError(err));
            done();
        })
    },
    getPasswordFromUser: function(username,done){
        usersDB.getUserByUserName(username,function(err,user){
            if(err) return done(new errors.SqlError(err));
            done(null,user.password);
        })
    },
    getEmailFromUser: function(username,done){
        usersDB.getUserByUserName(username,function(err,user){
            if(err) return done(new errors.SqlError(err));
            done(null,user.email);
        })
    }
}




module.exports= usersDB;