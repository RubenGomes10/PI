var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var multer  = require('multer');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport'); // To authenticate an user
var pgSql = require('./public/javascripts/pgSQL');
var localStrategy = require('./public/javascripts/psLocalStrategy');
var errors = require('./public/javascripts/errors');
var routes = require('./routes/index');


var app = express();

var test = require('./public/javascripts/tests/inserts');
test.test1();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'Amazing secret', saveUninitialized: true, resave: false }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
passport.use(localStrategy.strategy);
localStrategy.userSerialization(passport);
localStrategy.userDeserialization(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    if(req.isAuthenticated()){
        pgSql.select('followedadvertisement', {usernameuser : req.user.username, changed : true}, function(err,results){
            if(err) new errors.SqlError(err);
            else req.nNotifications = results.rowCount;
            next();
        });
    }else{
        next();
    }
});

app.use(multer(
    {
        dest: './public/uploads',
        rename: function (fieldname, filename) {
            return filename+Date.now();
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...')
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path)
            done=true;
        }
    })
);

app.use('/',routes);
app.post('/login',passport.authenticate('local',{ successRedirect : '/', failureRedirect : '/login', failureFlash : true}));
app.get('/logout',localStrategy.logout);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
