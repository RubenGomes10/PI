/**
 * Created by Ruben Gomes on 26/07/2015.
 */
var commentDB  = require('../models/commentsDB'),
    followedDB = require('../models/followedAdvertisementDB'),
    errors     = require('../public/javascripts/errors');


var commentsController = {
    postComment: function(req,res){
        if(!req.isAuthenticated()) {
            res.render('home/login', {url: '/login', message: 'Precisas de estar logado para comentar um anúncio!',
                success: false, authenticated: false, nNotifications: req.nNotifications});
            return;
        }
        var advertisementId = req.params.id;
        commentDB.insertComment({description: req.body.commentDescription, usernameuser: req.user.username, advertisementid: advertisementId},
            function(err){
                if(err) return err;
                followedDB.updateData({changed: {value: true, isSet: true}, advertisementid: advertisementId, usernameuser:req.user.username},
                    function(err){
                        if(err) return err;
                        res.redirect('/adds/'+advertisementId);

                    }
                );
            }
        );

    },


}


module.exports = commentsController;