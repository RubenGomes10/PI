var express             = require('express'),
    router              = express.Router(),
    homeController      = require('../controllers/home'),
    addsController      = require('../controllers/adds'),
    commentsController  = require('../controllers/comments'),
    usersController     = require('../controllers/users'),
    dashboardController = require('../controllers/dashboard'),
    changeAddController = require('../controllers/changeAdd');


/**
 * Home page routes
 */
router.get('/',homeController.index);
router.get('/adds',homeController.adds);
router.use('/about', homeController.about);
router.get('/login',homeController.login);
router.get('/authentication',homeController.register);
router.get('/dashboard',dashboardController.getDash);


/**
 * forgot routes
 */
router.get('/forgotPass', usersController.getForgot);
router.get('/forgotPass/user/:username', usersController.getUser);
router.get('/forgotPass/response/:username/:response', usersController.getResponse);
router.get('/forgotPass/password/:username/:password', usersController.getPassword);

/**
 * advertisements routes
 **/
router.get('/adds/:id',addsController.getAdd);
router.post('/adds', addsController.post);
router.get('/adds/page/:id', addsController.getPage);
router.get('/adds/:id/delete', addsController.deleteAdd);
router.get('/adds/:id/update',changeAddController.getAdd);
router.post('/adds/:id/update', changeAddController.updateAdd);


/**
 * user routes
 */
router.post('/register', usersController.post);


/**
 * followers routes
 */
router.use('/adds/:id/follow',addsController.follow);


/**
 * comments routes
 */
router.get('/adds/:id/comments',commentsController.getComments);
router.post('/adds/:id/comment',commentsController.postComment);


module.exports = router;
