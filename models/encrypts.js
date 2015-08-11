/**
 * Created by Ruben Gomes on 23/07/2015.
 */
var bcrypt = require('bcryptjs');

var encrypt = {
    hash: function (text, callback) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                callback(err);
                return;
            }
            bcrypt.hash(text, salt, function (err, hash) {
                callback(err, hash);
            });
        });
    },

    compare: function (text1, text2, callback) {
        bcrypt.compare(text1, text2, function (err, res) {
            callback(err, res);
        });
    }
};

module.exports = encrypt;