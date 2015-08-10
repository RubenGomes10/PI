/**
 * Created by Ruben Gomes on 26/07/2015.
 */

var addsDB     = require('../models/advertisementsDB'),
    commentsDB = require('../models/commentsDB'),
    errors     = require('../public/javascripts/errors');

var changeAddController = {
    getAdd: function(req,res){
        if(!req.isAuthenticated()) {
            res.render('login', {url: '/login', message: 'Precisas de estar logado para alterar um anúncio!',
                success: false, authenticated: false, nNotifications: req.nNotifications});
            return;
        }
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
                            advertisement: add.rows.shift(),
                            authenticated: true,
                            nNotifications: req.nNotifications,
                            updateAdd: true
                        }
                    );
                });
            });
        });
    },
    updateAdd: function(req,res){
        if(!req.isAuthenticated()) {
            res.render('login', {url: '/login', message: 'Precisas de estar logado para alterar uma anúncio!',
                success: false, authenticated: false, nNotifications: req.nNotifications});
            return;
        }
        if(req.body.title == '')
            res.render('advertisements/advertisement', { message: '  Algum campo não está preenchido', failAdd: true,
                user: req.user, authenticated: true, nNotifications: req.nNotifications});
        addsDB.updateAdd(
            {
                title: {value: req.body.title, isSet: true},country: {value: req.body.country, isSet: true},
                pictures: {value: req.body.pictures, isSet: true},description: {value: req.body.description, isSet: true},
                id: req.params.id
            },
            function(err){
                if(err) return err;
                commentsDB.insertComment(
                    {
                        usernameuser: req.user.username,
                        description: "Anúncio alterado por "+req.user.username+" para: "+req.body.title,
                        advertisementid: req.params.id
                    },
                    function(err){
                        if(err) return err;
                        res.redirect(req.url);
                    }
                );
            }
        )
    }
}

module.exports= changeAddController;