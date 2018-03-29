const pg = require("pg");
var connectionString = "postgres://postgres:root@localhost:5432/postgres";
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/tutorial';
const pgClient = new pg.Client(connectionString);

pgClient.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  console.log("Connected");
});

var sQuery = 'INSERT INTO public.users(user_name, id) VALUES($1, $2) RETURNING *'
var sUserName = "Birna"
var sUserId = '4'
pgClient.query(sQuery, [sUserName, sUserId], (err, result) => {
  if (err) {
    console.log(err);
    process.exit();
    return;
  }
  console.log(result.rows[0]);
  pgClient.end();
});