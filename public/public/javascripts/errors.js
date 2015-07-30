var errorTypes = {
	SqlError: 'SqlError',
	RuntimeError: 'RuntimeError',
	UserError: 'UserError'
};

module.exports.SqlError = function (err, message) {
	error(errorTypes.SqlError, err, message);
};

module.exports.RuntimeError = function (err) {
	error(errorTypes.UserError, err);
};

module.exports.UserError = function (message) {
	error(errorTypes.UserError, null, message);
};

function error(errorType, err, message){
	console.log('ERROR: '+errorType);
	this.name = errorType;
	if(message !== undefined) {
		this.message = message;
		console.log('MESSAGE: '+message);
	}

	if(err !== undefined) {
		this.err = err;
		console.log('ADDITIONAL INFORMATION:');
		console.log(err);
	}
}