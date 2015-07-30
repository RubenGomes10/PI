/**
 * Created by Ruben Gomes on 26/07/2015.
 */
var addsDB = require('../models/advertisementsDB');
var followersDB = require('../models/followedAdvertisementDB');
var commentsDB = require('../models/commentsDB');
var pgSql  = require('../public/javascripts/pgSql'), // To access the database
    errors = require('../public/javascripts/errors'),
    geoip  = require('geoip-lite'),
    MAX_ADVERTISEMENTS_PER_PAGE = 10;

var addsController = {
    getPage: function(req,res){
        var currentPage = req.params.id;
        if(currentPage === '' || currentPage<1)
            res.redirect('/adds/page/1');

        var nPages;
        addsDB.getAllAdds(function(err,results){
            if(err) return new errors.SqlError(err);
            if(results.rowCount === 0){
                res.render('advertisements/advertisements',
                    {
                        title: 'Anúncios', user: req.user, nPages: nPages, currentPage: currentPage,
                        authenticated: isAuthenticated(req), nNotifications: req.nNotifications
                    }
                );
                return;
            }
            nPages = Math.ceil(results.rowCount / MAX_ADVERTISEMENTS_PER_PAGE);
            if (currentPage > nPages) currentPage = nPages;
            pgSql.query('SELECT * FROM advertisement ORDER BY publishdate DESC, publishtime DESC LIMIT $1 OFFSET $2',
                [MAX_ADVERTISEMENTS_PER_PAGE, (currentPage - 1) * MAX_ADVERTISEMENTS_PER_PAGE],
                function (err, results) {
                    if (err) return new errors.SqlError(err);
                    if (results.rowCount === 0) {
                        res.render('advertisements/advertisements',
                            {
                                title: 'Advertisements', user: req.user, nPages: nPages, currentPage: currentPage,
                                authenticated: isAuthenticated(req), nNotifications: req.nNotifications
                            }
                        );
                        return;
                    }
                    addsDB.addDataToAdvertisement(results.rows, 0, function (err) {
                        if (err) return new errors.SqlError(err);
                        addsDB.addCommentsToAdvertisement(results.rows, 0, function (err) {
                            if (err) return new errors.SqlError(err);
                            res.render('advertisements/advertisements',
                                {
                                    title: "Advertisements",
                                    user: req.user,
                                    advertisements: results.rows,
                                    nPages: nPages,
                                    currentPage: currentPage,
                                    authenticated: isAuthenticated(req),
                                    nNotifications: req.nNotifications
                                }
                            )
                        });
                    });
                });
        });


    },
    getAdd: function(req,res){
        addsDB.getAddById(req.params.id,function(err,add){
            if(err) return new errors.SqlError(err);
            console.log(add.rows);
            addsDB.addDataToAdvertisement(add.rows, 0, function (err) {
                if (err) return new errors.SqlError(err);
                addsDB.addCommentsToAdvertisement(add.rows, 0, function (err) {
                    if (err) return new errors.SqlError(err);
                    console.log(add.rows);
                    res.render('advertisements/advertisement',
                        {
                            title: "Advertisement",
                            user: req.user,
                            advertisement: add.rows[0],
                            authenticated: isAuthenticated(req),
                            nNotifications: req.nNotifications
                        }
                    );
                });
            });
        });
    },

    deleteAdd: function(req,res){
        if(!isAuthenticated(req)) {
            res.render("error", {message: "Não tem permissão para apagar um anúncio!",
                error: {status: null, stack: null}, nNotifications: req.nNotifications, authenticated: req.isAuthenticated, user: req.user});
            return;
        }
        addsDB.getAddById(req.params.id, function(err,result){
            if(err) return err;
            if(req.user.username !== result.rows[0].username){
                res.render("error", { message: "Não tem permissão para apagar este anúncio!" ,
                    error: { status: null, stack: null }, nNotifications: req.nNotifications, authenticated: req.isAuthenticated, user: req.user });
            }
            else{
                commentsDB.deleteComments(req.params.id,function(err) {
                    if(err) return err;
                    followersDB.deleteFollowers(req.params.id,function(err) {
                        if(err) return err;
                        addsDB.deleteAdd(req.params.id, function (err) {
                            if (err) return err;
                            followersDB.updateData({
                                    changed: {value: true, isSet: true},
                                    advertisementid: req.params.id
                                },
                                function (error) {
                                    if (error) return new errors.SqlError(error);
                                    res.redirect('/adds/page/1');
                                });
                        })
                    });
                });
            }
        });



    },
    follow: function(req,res){
        if(!req.isAuthenticated()) {
            res.send({url: '/login', message: 'Precisas de estar logado para seguir um anúncio!',
                success: false, authenticated: false, nNotifications: req.nNotifications});
            return;
        }
        var advertisementId = req.params.id;
        followersDB.getFollowers({advertisementid: advertisementId, usernameuser: req.user.username},  function(err, results) {
            if(err) { res.send(err); return err };
            if(results.rowCount == 0)
               followersDB.insertFollower({usernameuser: req.user.username,advertisementid: advertisementId}, function(err){
                    if(err) {res.send(err); return err};
                   followersDB.getFollowers({advertisementid: advertisementId}, function(err, results){
                        if(err) return err;
                        res.send({following: results.rowCount});
                    });
                });
            else
                res.send();
        });

    },
    post: function(req,res) {
        if (!isAuthenticated(req)) {
            console.log('Nao autenticado!');
            res.render('home/login', {
                message: 'Necessitas de estar logado para postares Anúncios',
                success: true,
                authenticated: false
            });
        }
        else {
            var geo = geoip.lookup(req.header('x-forwarded-for'));
            var city, country;
            if (geo != null) {
                city = geo.city;
                country = geo.country;
            }
            addsDB.postAdd(req.body.title,req.body.description,req.user.username,country,city,null,function(err){
                if(err) return err;
                addsDB.getAllAdds(function(err,results){
                    if (err) {
                        res.render('advertisements/advertisements',{advertisements: results.rows, message: 'O anúncio não foi introduzido!', failAdd: true, authenticated: true, user:req.user});
                    }
                    res.render('advertisements/advertisements',{advertisements: results.rows, message: 'O anúncio foi introduzido com successo!', failAdd: false,authenticated: true, user:req.user});
                });
            });
        }

    }
}


function isAuthenticated(req){
    return req.is != undefined ? req.isAuthenticated() : false
}

module.exports= addsController;