const pg = require("pg");
var connectionString = "postgres://postgres:root@localhost:5432/postgres";
const pgClient = new pg.Client(connectionString);

pgClient.connect(function(err) {
    if(err) {
        return console.error('could not connect to postgres', err);
    }
    console.log("Connected");
});

const aParams = '4'
const sQuery = 'SELECT * FROM users WHERE "id" = $1'

pgClient.query(sQuery, [aParams], (err, res) => {
    if(err){
        console.log(err)
    }
    var ajData = res.rows
    console.log(ajData)
    pgClient.end()
})