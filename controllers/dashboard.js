/**
 * Created by Ruben Gomes on 26/07/2015.
 */
var pgSql  = require('../public/javascripts/pgSql'), // To access the database
    errors = require('../public/javascripts/errors');


var dashboardController = {
    getDash: function(req,res){
        var followedadds = [];
        var isAuthenticated = req.isAuthenticated();
        if(isAuthenticated)
        {
            pgSql.query('SELECT advertisement.*, COALESCE(nComments,0) as nComments, COALESCE(nFollows,0) as nFollows ' +
                'FROM followedadvertisement ' +
                'INNER JOIN advertisement ON advertisement.id = followedadvertisement.advertisementid ' +
                'LEFT OUTER JOIN (SELECT advertisementid, COUNT(advertisementid) as nComments ' +
                '				  FROM _comment ' +
                '				  GROUP BY advertisementid) as CommentsCount ON CommentsCount.advertisementid = advertisement.id ' +
                'LEFT OUTER JOIN (SELECT advertisementid, COUNT(advertisementid) as nFollows ' +
                '				  FROM followedadvertisement ' +
                '				  GROUP BY advertisementid) as FollowsCount ON FollowsCount.advertisementid = advertisement.id ' +
                'WHERE followedadvertisement.usernameuser =$1 ORDER BY changed DESC', [ req.user.username ], function(err, results) {
                if(err)
                    return new errors.SqlError(err);
                pgSql.query('DELETE ' +
                    'FROM followedadvertisement ' +
                    'USING advertisement ' +
                    'WHERE advertisementid = id AND closed = true AND followedadvertisement.usernameuser = $1', [req.user.username], null);

                pgSql.query('UPDATE followedadvertisement SET changed = false WHERE usernameuser = $1', [ req.user.username ], null );

                for(var i = 0; i < results.rowCount; i++) {
                    results.rows[i].publishtime = results.rows[i].publishtime.substring(0, results.rows[i].publishtime.lastIndexOf(':'));
                    followedadds.push(results.rows[i]);
                }

                res.render('dashboard/dashboard',
                    {
                        title: 'Dashboard',
                        user: req.user,
                        authenticated: isAuthenticated,
                        nNotifications: req.nNotifications,
                        followedadds: followedadds
                    });
            });
        } else
            res.redirect('/login');

    }
}

module.exports = dashboardController;