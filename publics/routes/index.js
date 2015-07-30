var express = require('express');
var router = express.Router();
var homeController = require('../controllers/home');
var addsController = require('../controllers/adds');
var commentsController  = require('../controllers/comments');
var usersController = require('../controllers/users');
var dashboardController = require('../controllers/dashboard');
var changeAddController = require('../controllers/changeAdd');


/* Routes in Home page*/ //Done
router.get('/',homeController.index);//done
router.get('/adds',homeController.adds);//done
router.use('/about', homeController.about);//done
router.get('/login',homeController.login);//done
router.get('/authentication',homeController.register);//done
router.get('/dashboard',dashboardController.getDash); //missing


/*GET forgot routes */
router.get('/forgotPass', usersController.getForgot); //done
router.get('/forgotPass/user/:username', usersController.getUser);//missing
router.get('/forgotPass/response/:response', usersController.getResponse);//missing
router.get('/forgotPass/password/:password', usersController.getPassword);//missing

/*Routes for adds */

router.get('/adds/:id',addsController.getAdd); //done
router.get('/adds/page/:id', addsController.getPage); // done
router.get('/adds/:id/update',changeAddController.getAdd);//done
router.get('/adds/page/:id/*', addsController.getPage); //filters ( verify body)


router.post('/adds', addsController.post); //done
router.get('/adds/:id/delete', addsController.deleteAdd);//done
router.post('/adds/:id/update', changeAddController.updateAdd);//done

/* Routes for user*/
router.post('/register', usersController.post); // done

/*Routes for followers*/

/* route for followers*/
router.use('/adds/:id/follow',addsController.follow); //done


/**
 *
 * Routes for comments
 *
 */
router.post('/adds/:id/comment',commentsController.postComment);//done





module.exports = router;
