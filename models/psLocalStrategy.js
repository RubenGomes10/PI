/**
 * Created by Ruben Gomes on 23/07/2015.
 */
var localStrategy = require('passport-local').Strategy; // Strategy to link database data and authenticate an user
var encrypt = require('encrypt');
var pgSql = require('pgSQL');


/*Strategy to authenticate user */
module.exports.strategy = new localStrategy({passReqToCallback : true},function(req,username,password,done){
   console.log(username + " "+ password);
    if(username == '' || password == ''){
       done(null,false,req.flash('signupMessage', "Campos não estão totalmente preenchidos!"));
       return;
   }
   pgSql.select('_user',{username : username }, function(err,result) {
       if (err) {
           done(null, false, req.flash('signupMessage', 'Username ou password forem introduzidos incorrectamente!'));
           return;
       }
       if(result.rowCount === 1){

           encrypt.compare(password,result.rows[0].password,function(err,resp){
               if(err) { done(err); return;}
               if(resp) done(null,{id : username});
               else done(null,false, req.flash('signupMessage', 'Password incorrecta!'))
           });
       }else{
           done(null,false, req.flash('signupMessage', 'Utilizador nao existe!'));
       }
   });
});

/* Serialize user with id*/
module.exports.userSerialization = function(pass){
    pass.serializeUser(function(user,done){
        done(null,user.id);
    });
};

/*Deserialize user with id to get his data */
module.exports.userDeserialization = function (pass) {
    pass.deserializeUser(function(id,done){
        pgSql.select('_user',{username : id},function(err,result){
            if(err){ done(err); return;}
            done(null,
                {
                    username : result.rows[0].username,
                    password : result.rows[0].password,
                    email : result.rows[0].email,
                    firstname : result.rows[0].firstname,
                    lastname : result.rows[0].lastname,
                    question : result.rows[0].question,
                    response : result.rows[0].response
                }
            );
        });
    });
};

/*Logout user */
module.exports.logout = function(req,res){
    req.logout();
    res.redirect('/');
}