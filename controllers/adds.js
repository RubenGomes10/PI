/**
 * Created by Ruben Gomes on 26/07/2015.
 */

var pgSql       = require('../public/javascripts/pgSQL.js'), // To access the database
    errors      = require('../public/javascripts/errors.js'),
    geoip       = require('geoip-lite'),
    addsDB      = require('../models/advertisementsDB.js'),
    followersDB = require('../models/followedAdvertisementDB.js'),
    commentsDB  = require('../models/commentsDB.js'),
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
                resolveFilter(req.query,currentPage,function(query,values) {
                    nPages = Math.ceil(results.rowCount / MAX_ADVERTISEMENTS_PER_PAGE);
                    if (currentPage > nPages) currentPage = nPages;
                    pgSql.query(query,values, function (err, results) {
                        if (err) return new errors.SqlError(err);
                        if (results.rowCount === 0) {
                            res.render('advertisements/advertisements',
                                {
                                    title: 'Advertisements',
                                    user: req.user,
                                    nPages: nPages,
                                    currentPage: currentPage,
                                    authenticated: isAuthenticated(req),
                                    nNotifications: req.nNotifications
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
        });
    },
    getAdd: function(req,res){
        addsDB.getAddById(req.params.id,function(err,add){
            if(err) return new errors.SqlError(err);
            addsDB.addDataToAdvertisement(add.rows, 0, function (err) {
                if (err) return new errors.SqlError(err);
                addsDB.addCommentsToAdvertisement(add.rows, 0, function (err) {
                    if (err) return new errors.SqlError(err);
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
            var photo = "";
            if(req.files.userPhoto === undefined)
                photo = __dirname.substr(2)+'public/uploads/Default-image.jpg';
            else
                photo = req.files.userPhoto.path;
            addsDB.postAdd(req.body.title,req.body.description,req.user.username,country,city,photo,function(err){
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

function resolveFilter(query,currentPage,done){
    if(query.title != undefined && query.category !== '' && query.city !== '')
        done('SELECT * FROM advertisement WHERE title=$1 AND category=$2 AND city=$3 ORDER BY publishdate DESC, publishtime DESC LIMIT $4 OFFSET $5',
                [query.title,query.category,query.city,MAX_ADVERTISEMENTS_PER_PAGE,(currentPage - 1) * MAX_ADVERTISEMENTS_PER_PAGE]);
    if(query.title !== undefined && query.title !== ''){
        if(query.category !== '')
            done('SELECT * FROM advertisement WHERE title=$1 AND category=$2 ORDER BY publishdate DESC, publishtime DESC LIMIT $3 OFFSET $4',
                [query.title,query.category,MAX_ADVERTISEMENTS_PER_PAGE, (currentPage - 1) * MAX_ADVERTISEMENTS_PER_PAGE]);
        else if(query.city !== '')
            done('SELECT * FROM advertisement WHERE title=$1 AND city=$2 ORDER BY publishdate DESC, publishtime DESC LIMIT $3 OFFSET $4',
                [query.title,query.city,MAX_ADVERTISEMENTS_PER_PAGE, (currentPage - 1) * MAX_ADVERTISEMENTS_PER_PAGE]);
        else
            done('SELECT * FROM advertisement WHERE title=$1 ORDER BY publishdate DESC, publishtime DESC LIMIT $2 OFFSET $3',
                [query.title,MAX_ADVERTISEMENTS_PER_PAGE, (currentPage - 1) * MAX_ADVERTISEMENTS_PER_PAGE]);
    }else if(query.category !== undefined && query.category !== ''){
            if(query.city !== '')
                done('SELECT * FROM advertisement WHERE category=$1 AND city=$2 ORDER BY publishdate DESC, publishtime DESC LIMIT $3 OFFSET $4',
                    [query.category,query.city,MAX_ADVERTISEMENTS_PER_PAGE, (currentPage - 1) * MAX_ADVERTISEMENTS_PER_PAGE]);
            else
                done('SELECT * FROM advertisement WHERE category=$1 ORDER BY publishdate DESC, publishtime DESC LIMIT $2 OFFSET $3',
                    [query.category,MAX_ADVERTISEMENTS_PER_PAGE, (currentPage - 1) * MAX_ADVERTISEMENTS_PER_PAGE]);
    }else if(query.city !== undefined && query.city !== '') {
        done('SELECT * FROM advertisement WHERE city=$1 ORDER BY publishdate DESC, publishtime DESC LIMIT $2 OFFSET $3',
            [query.city, MAX_ADVERTISEMENTS_PER_PAGE, (currentPage - 1) * MAX_ADVERTISEMENTS_PER_PAGE]);
    }else
        done('SELECT * FROM advertisement ORDER BY publishdate DESC, publishtime DESC LIMIT $1 OFFSET $2',
            [MAX_ADVERTISEMENTS_PER_PAGE, (currentPage - 1) * MAX_ADVERTISEMENTS_PER_PAGE]);
}


function isAuthenticated(req){
    return req.is != undefined ? req.isAuthenticated() : false
}

module.exports= addsController;