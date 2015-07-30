var pgSql = require('../pgSql'), // To access the database
    errors = require('../errors');

function deleteAll(callback) {
  pgSql.query('DELETE FROM "followedadvertisement"', null, function(err) {
    if(err) { callback(err); return;}
      pgSql.query('DELETE FROM "_comment"', null, function(err) {
        if(err) { callback(err); return; }
        pgSql.query('DELETE FROM "advertisement"', null, function(err) {
          if(err) { callback(err); return; }
          pgSql.query('DELETE FROM "_user"', null, function(err) {
            callback(err);
          });
        });
      });
    });
}

function test1_insertUsers(done){
  pgSql.insertUser('RubenGomes', 'gomes', 'gomesruben21@gmail.com', 'Rúben', 'Gomes','Onde vives?', 'Alcobaça', function(err){
    if(err) return new errors.SqlError(err, "Insert of User RúbenGomes failed!");
    pgSql.insertUser('HomilzioTrovoada', 'trovoada', 'trovoada@gmail.com', 'Homílzio', 'Trovoada','Onde vives?', 'Caldas da Rainha', function(err){
      if(err) return new errors.SqlError(err, "Insert of User HomílzioTrovoada failed!");
      pgSql.insertUser('JurandySantos', 'jurandy', 'jurandy@gmail.com', 'Jurandy', 'Santos','Onde vives?', 'Lisboa', function(err){
        if(err) return new errors.SqlError(err, "Insert of User JurandySanto failed!");
          done();
        });
      });
    });
}

function test1_insertAdvertisements(done){
  pgSql.insert('advertisement', {title: 'Fiat Punto', description:'',category : 'Carros', country:'PT', city:'Lisboa', pictures : 'http://img.olx.pt/images_olxpt/835669655_9_644x461_bmw-320-da-_rev005.jpg', username:'RubenGomes'}, function(err){
    if(err) return new errors.SqlError(err, "Insert of Advertisement#1 failed!");
    pgSql.insert('advertisement', {title:'Pausa', description:'',category : 'Culture', country:'PT', city:'Lisboa',pictures : 'https://scontent-fra3-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/10306267_878116958881391_5408628373261897303_n.jpg?oh=9e7e903409fdacec420c65136c3dbf3c&oe=55E698A1', username:'JurandySantos'}, function(err){
      if(err) return new errors.SqlError(err, "Insert of Advertisement#2 failed!");
      pgSql.insert('advertisement', {title:'Casa no Campo T3 para Ferias', description:'',category : 'Casas', country:'PT', city:'Estádio da Luz',pictures : 'http://www.casaprefabricada.org/wp-content/uploads/2012/01/casas-modulares.jpg',  username:'HomilzioTrovoada'}, function(err){
        if(err) return new errors.SqlError(err, "Insert of Advertisement#3 failed!");
              done();
      });
    });
  });
}

function test1_insertFollowedAdvertisements(id, done){
  pgSql.insert('followedadvertisement', {usernameuser: 'RubenGomes', advertisementid: id}, function(err){
    if(err) return new errors.SqlError(err, "Insert of FollowedAdvertisement RúbenGomes#1 failed!");
    pgSql.insert('followedadvertisement', {usernameuser:'RubenGomes', advertisementid: id+1}, function(err){
      if(err) return new errors.SqlError(err, "Insert of FollowedAdvertisement RúbenGomes#2 failed!");
      pgSql.insert('followedadvertisement', {usernameuser:'RubenGomes', advertisementid: id+2}, function(err){
        if(err) return new errors.SqlError(err, "Insert of FollowedAdvertisement RúbenGomes#3 failed!");
        pgSql.insert('followedadvertisement', {usernameuser:'HomilzioTrovoada', advertisementid: id}, function(err){
          if(err) return new errors.SqlError(err, "Insert of FollowedAdvertisement HomílzioTrovoada#1 failed!");
          pgSql.insert('followedadvertisement', {usernameuser:'HomilzioTrovoada', advertisementid: id+1}, function(err){
            if(err) return new errors.SqlError(err, "Insert of FollowedAdvertisement HomílzioTrovoada#2 failed!");
            pgSql.insert('followedadvertisement', {usernameuser:'JurandySantos', advertisementid: id}, function(err){
              if(err) return new errors.SqlError(err, "Insert of FollowedAdvertisement JurandySantos#1 failed!");
              pgSql.insert('followedadvertisement', {usernameuser:'JurandySantos', advertisementid: id+1}, function(err){
                if(err) return new errors.SqlError(err, "Insert of FollowedAdvertisement JurandySantos#2 failed!");
                pgSql.insert('followedadvertisement', {usernameuser:'JurandySantos', advertisementid: id+2}, function(err){
                  if(err) return new errors.SqlError(err, "Insert of FollowedAdvertisement JurandySantos#3 failed!");
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
}


function test1_insertComments(id, done){
  pgSql.insert('_comment', {description: 'Qual o preço/condiçoes?!', usernameuser: 'JurandySantos',advertisementid : id}, function(err){
    if(err) return new errors.SqlError(err, "Insert of Comment failed!");
    pgSql.insert('_comment', {description: '1000€ + IVA...', usernameuser: 'RubenGomes', advertisementid: id}, function(err){
      if(err) return new errors.SqlError(err, "Insert of Comment failed!");
      pgSql.insert('_comment', {description: 'Muito bem vou pensar no assunto!', usernameuser: 'JurandySantos', advertisementid: id}, function(err){
        if(err) return new errors.SqlError(err, "Insert of Comment failed!");
        pgSql.insert('_comment', {description: 'Esteja a vontade!', usernameuser: 'RubenGomes', advertisementid: id}, function(err){
          if(err) return new errors.SqlError(err, "Insert of Comment failed!");
          pgSql.insert('_comment', {description: 'Pausa do kit-kat -)!', usernameuser: 'HomilzioTrovoada', advertisementid: id+1}, function(err){
            if(err) return new errors.SqlError(err, "Insert of Comment failed!");
            pgSql.insert('_comment', {description: 'Qual é o preço da Renda??!', usernameuser: 'RubenGomes', advertisementid: id+2}, function(err){
              if(err) return new errors.SqlError(err, "Insert of Comment failed!");
              pgSql.insert('_comment', {description: '500 € + despesas.', usernameuser: 'HomilzioTrovoada', advertisementid: id+2}, function(err){
                if(err) return new errors.SqlError(err, "Insert of Comment failed!");
                done();
              });
            });
          });
        });
      });
    });
  });
}

module.exports.test1 = function(){
 deleteAll(function(err){
    if(err) return new errors.SqlError(err, "Delete of all values failed!");
    console.log('TEST #1 - Begin.');
    test1_insertUsers(function(){
      test1_insertAdvertisements(function(){
        pgSql.query('SELECT MIN(id) FROM advertisement', null, function(err, results){
          if(err) return new errors.SqlError(err, "Getting the advertisement with the lowest id!");
          var id = results.rows[0].min;
          test1_insertFollowedAdvertisements(id, function(){
            test1_insertComments(id, function(){
                console.log('TEST #1 - Done!');
            });
          });
        });
      });
    });
  });
};
