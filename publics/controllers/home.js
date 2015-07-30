/**
 * Created by Ruben Gomes on 26/07/2015.
 */



var homeController = {
    index: function(req,res){
        res.render('home/index',
            {
                title: 'Home',
                authenticated: isAuthenticated(req),
                user: req.user,
                nNotifications: req.nNotifications
            }
        );
    },
    adds: function (req,res) {
      res.redirect('adds/page/1');
    },
    about: function(req,res){
      res.render('home/about',
          {
              title: "About",
              authenticated: isAuthenticated(req),
              user: req.user,
              nNotifications: req.nNotifications
          }
      );
    },
    login: function(req,res){
        var message = req.flash('signupMessage');
        res.render('home/login',
            {
                title: 'Login',
                message: message == undefined ? req.message : message,
                success: req.success,
                user: req.user,
                authenticated: isAuthenticated(req),
                nNotifications: req.nNotifications
            }
        );
    },
    register: function(req,res){
        res.render('home/register',
            {
                title: 'Register',
                message: req.flash('registerMessage'),
                user: req.user,
                authenticated: isAuthenticated(req),
                nNotifications: req.nNotifications
            }
        );
    }
}

function isAuthenticated(req){
    return req.is != undefined ? req.isAuthenticated() : false
}


module.exports = homeController;
