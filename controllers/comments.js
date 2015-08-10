/**
 * Created by Ruben Gomes on 26/07/2015.
 */
var commentDB  = require('../models/commentsDB'),
    followedDB = require('../models/followedAdvertisementDB'),
    errors     = require('../public/javascripts/errors');


var commentsController = {
    getComments : function(req,res){
        if(req.headers['accept'].indexOf('text/plain') != -1){
            commentDB.getCommentsFromAdd(req.params.id,function(err,comments){
                if(err) return err;
                var content = "";
                if(comments.rows.length>0){
                    comments.rows.forEach(function(row){
                        content += "#" + row.usernameuser + "," + row.description;
                    });
                }
                res.writeHead(200,{ 'Content-Type' : 'text/plan; charset=utf8'});
                res.write(content,'utf8');
                res.end();
            })
        }else{
            res.redirect('/');
        }
    },
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