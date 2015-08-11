/**
 * Created by R�ben Gomes on 27-07-2015.
 */
var pgSql  = require('pgSQL.js'), // To access the database
    errors = require('../public/javascripts/errors.js');



var usersDB = {
    getAllUsers: function(done){
        pgSql.select('_user', null,function(err,users){
            if(err) return done(new errors.SqlError(err));
            done(null,users);
        });
    },
    getUserByUserName: function(username,done) {
        pgSql.select('_user', {username: username}, function (err, results) {
            if (err) return done(new errors.SqlError(err));
            if(results.rowCount === 0)
                done(null,null);
            else
                done(null, results.rows.shift());
        })
    },
    getResponseFromUser: function(username,done){
        usersDB.getUserByUserName(username,function(err,user){
            if(err) return done(err);
            if(user === null)
                done(null, null);
            else
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
            if(user === null)
                done(null,null);
            else
                done(null,user.password);
        })
    },
    getEmailFromUser: function(username,done){
        usersDB.getUserByUserName(username,function(err,user){
            if(err) return done(new errors.SqlError(err));
            if(user === null)
                done(null,null);
            done(null,user.email);
        })
    }
}




module.exports= usersDB;