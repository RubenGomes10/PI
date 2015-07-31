/**
 * Created by Ruben Gomes on 23/07/2015.
 */
var conString, //= "pi://postgres:ruben10@localhost:3000/ChelasLxDB",
	//var conString= "pi://postgres:qwerty@localhost:5432/postgres", //change by the prop file
    confFile= require('../configDB'), //you must create a config file like that and put it at git ignore
    pg = require('pg'),
    encrypt = require('./encrypt');
    //errors = require('./errors');
    conString="pi://"+confFile.username+":"+ confFile.password +"@" +confFile.hostname +":"+confFile.port+"/"+confFile.database;
    console.log(conString);

/* Connect to the dataBase to optain results*/
module.exports.query = function(queryString,values,callback){
    pg.connect(process.env.DATABASE_URL, function(err,client,done){
        if(err){ callback(err); return;}
        client.query(queryString,values,function(err,result){
            done();
            if(callback) callback(err,result);

        });
    });

};

/* Select query*/
module.exports.select = function(table,values,callback){
    if(values != null){
        buildWhereClause(values,function(where){
            selectEnd(table,where,callback);
        });
    }else{
        selectEnd(table,null,callback);
    }

};

/*Insert query */
module.exports.insert = function(table,values,callback){
    buildInsertClause(table,values,function(insert){
       module.exports.query(insert.query,insert.values,function(err){
           callback(err);
       } )
    });
};

module.exports.delete = function(table,values,callback){
    if(values != null) {
        buildWhereClause(values, function(where){
            deleteEnd(table,where,callback);
        });
    }else{
        deleteEnd(table,null,callback);
    }
}

/*update query */
module.exports.update = function(table, values, callback){
    buildUpdateClause(table, values, function(update){
        module.exports.query(update.query, update.values, function(err, result) {
            callback(err, result);
        });
    });
};

/*insert user */
module.exports.insertUser = function(username, password,email, firstname, lastname, question, response, callback){
    encrypt.hash(password, function(err, hash){
        if(err) { callback(err); return; }
        encrypt.hash(response, function(err, hash2){
            if(err) { callback(err); return; }
            module.exports.insert('_user', {username: username, password: hash, email: email, firstname: firstname, lastname: lastname,
                question: question, response: hash2}, callback);
        });
    });
};


/*join all the query and calls the callback with results */
function selectEnd(table, where, callback) {
    var query = "SELECT * FROM " +table+ (where === null ? ' ' : where.query);
    module.exports.query(query,(where === null)? '' : where.values,function(err,results){
        if(err) {callback(err); return;}
        callback(null,results);
    });

};



/*join all the query and calls the callback with results */
function deleteEnd(table, where, callback) {
    var query = "DELETE FROM " +table+ (where === null ? ' ' : where.query);
    module.exports.query(query,(where === null)? '' : where.values,function(err,results){
        if(err) {callback(err); return;}
        callback(null,results);
    });

};



/* Arrange where clause for query */
function buildWhereClause(values, callback) {
    if(values == null){
        callback(null);
    }
    var where = ' WHERE ', i = 1, vals=[];
    for( var value in values){
        vals[i-1] = values[value];
        where += i>1 ? (' AND ' + value + '=$' +i++ ): ( ''+value + '=$' + i++);
    };
    callback({query : where , values : vals});
};


/*Arrange insert query */
function buildInsertClause(table,values,callback){
    var queryBegin = 'INSERT INTO ' +table+ '(',
        queryEnd = ') VALUES (', i = 1, vals = [];

    for(var value in values){
        vals[i-1] = values[value];
        queryBegin += i > 1 ? ', '+ value : value;
        queryEnd += i > 1 ? ', $'+i++ :  ' $'+i++;
    };
    queryEnd += ')';
    callback({query: queryBegin + queryEnd, values: vals});
};

/*Arrange update query */
function buildUpdateClause(table, values, callback) {
    var queryBegin = 'UPDATE ' + table + ' SET ',
        queryEnd = ' WHERE ', i = 1, j = 1, vals = [];
    for( var value in values){
        if (values[value].isSet) {
            vals[i-1] = values[value].value;
            queryBegin += i > 1 ? ', ' + value + '=$' + i++ : value + '=$' + i++;
        }
        else {
            vals[i-1] = values[value];
            queryEnd += j++ > 1 ? ' AND ' + value + '=$' + i++ : value + '=$' + i++;
        }
      };
    callback({query: queryBegin + queryEnd, values: vals});
}

