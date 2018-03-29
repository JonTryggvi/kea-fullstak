const pg = require("pg");
var connectionString = "postgres://postgres:root@localhost:5432/postgres";
const pgClient = new pg.Client(connectionString);

pgClient.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  console.log("Connected");
});

var sQuery = 'DELETE FROM users WHERE user_name = $1 AND id = $2';
var sUserName = 'Birna';
var iUserId = '4';
pgClient.query(sQuery, [sUserName, iUserId], (err, result ) => {
  if(err){
    console.log(err);
    process.exit();
    return;
  }
  console.log(result.rows);
  pgClient.end();
});