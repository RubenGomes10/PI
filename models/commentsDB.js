/**
 * Created by R�ben Gomes on 28-07-2015.
 */

var pgSql  = require('../public/javascripts/pgSql'), // To access the database
    errors = require('../public/javascripts/errors');

var commentsController={

    getCommentsFromAdd: function(id,done){
      pgSql.select('_comment',{advertisementid: id}, function(err,results){
          if(err) return done(new errors.SqlError(err));
          done(null,results);
      });
    },
    insertComment: function(values, done){
        pgSql.insert('_comment',values,function(err){
            if(err) return done(new errors.SqlError(err));
            done();
        })
    },
    deleteComments: function(id,done){
        pgSql.delete('_comment',{advertisementid: id},function(err){
            if(err) return done(new errors.SqlError(err));
            done();
        })
    }
}

module.exports =commentsController;