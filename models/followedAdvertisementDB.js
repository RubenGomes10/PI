/**
 * Created by R�ben Gomes on 28-07-2015.
 */
var pgSql  = require('pgSQL'), // To access the database
    errors = require('../public/javascripts/errors');


var followedAdvertisementDB = {
    updateData: function(values,done){
        pgSql.update('followedadvertisement',values,function(err){
            if(err) return done(new errors.SqlError(err));
            done();
        })
    },
    getFollowers: function(values,done){
      pgSql.select('followedadvertisement',values,function(err,results){
          if(err) return done(new errors.SqlError(err));
          done(null,results);
      })
    },
    insertFollower: function(values,done){
        pgSql.insert('followedadvertisement',values,function(err){
            if(err) return new errors.SqlError(err);
            done();
        })
    },
    deleteFollowers: function(id,done){
        pgSql.delete('followedadvertisement',{advertisementid: id},function(err){
            if(err) return done(new errors.SqlError(err));
            done();
        })
    }

};

module.exports = followedAdvertisementDB;