/**
 * Created by Ruben Gomes on 26/07/2015.
 */
var usersDB = require('../models/usersDB'),
    encrypt = require('../public/javascripts/encrypts.js'),
    pgSql   = require('../models/pgSQL.js'), // To access the database
    errors  = require('../public/javascripts/errors.js');

var usersController = {

    getUser: function(req,res){
        usersDB.getUserByUserName(req.params.username,function(err,user){
            console.log(user);
            if(err) return err;
            if(user === null)
                res.status(200).send({question: null});
            else
                res.status(200).send({question: user.question});
        })
    },
    getForgot: function (req,res) {
        res.render('authentication/forgotPassword',
            {
                title: 'forgotPassword',
                user: req.user,
                message: req.flash('registerMessage'),
                authenticated: isAuthenticated(req),
                nNotifications: req.nNotifications
        }
        );
    },
    getResponse: function(req,res){
        usersDB.getResponseFromUser(req.params.username,function(err,response){
            if(err) return err;
            if(response == null)
                res.status(200).send({response: false});
            else{
                encrypt .compare(req.params.response,response, function (err, same) {
                    res.status(200).send({response: same});
                });
            }

        })
    },
    getPassword: function(req,res){
        encrypt.hash(req.params.password, function(err, hash) {
            if(err) return new errors.RuntimeError(err);
            pgSql.update("_user", {password:{value: hash, isSet: true}, username: req.params.username}, function(err, data){
                if(err){
                    res.send({passwordChanged: false});
                    return new errors.RuntimeError(err);
                }res.send({passwordChanged: data.rowCount == 1});
            });
        });
    },
    post: function(req,res){
        usersDB.getUserByUserName(req.body.username,function(err,user){
            if(err || user !== null){
                res.render('home/register',
                    {
                        title: 'Registo',
                        message: 'O utilizador já esta registado',
                        authenticated: isAuthenticated(req),
                        nNotifications: req.nNotifications
                    }
                )
            }else{
                var user = req.body;
                usersDB.insertUser(user.username,user.password,user.email,user.firstname,user.lastname,user.question,user.response,function(err){
                    if(err){
                        res.render('home/register',
                            {
                                title: 'Registo', message: 'Erro na inserção do utilizador',
                                authenticated: isAuthenticated(req), nNotifications: req.nNotifications
                            }
                        );
                    }else{
                        if(req.isAuthenticated()){
                            res.render('home/register',
                                {
                                    title: 'Registo',
                                    message: 'Registo efectuado com sucesso',
                                    user: req.user,
                                    authenticated: true,
                                    success: true,
                                    nNotifications: req.nNotifications
                                }
                            );
                        }else{
                            res.render('home/login',
                                {
                                    title: 'Login',
                                    message: 'Registo efectuado com sucesso',
                                    user: req.user,
                                    success: true,
                                    authenticated: false,
                                    nNotifications: req.nNotifications
                                }
                            )
                        }
                    }
                });
            }

        });

    }
}

function isAuthenticated(req) {
    return req.isAuthenticated() !== undefined ? req.isAuthenticated() : false
}

module.exports = usersController;