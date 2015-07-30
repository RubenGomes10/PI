/**
 * Created by Ruben Gomes on 26/07/2015.
 */
var usersDB = require('../models/usersDB');


var usersController = {

    getUser: function(req,res){

    },
    getForgot: function (req,res) {
        res.render('authentication/forgotPassword',{title: 'forgotPassword'});
    },
    getResponse: function(req,res){

    },
    getPassword: function(req,res){

    },
    post: function(req,res){
        usersDB.getUserByUserName(req.body.username,function(err,user){
            if(err || user.rowCount > 0){
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