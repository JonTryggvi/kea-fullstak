var express = require('express')
var app = express();
var chalk = require('chalk')
var formidable = require('express-formidable')
app.use(formidable())
const mongo = require('mongodb').MongoClient;
global.db = null
var sDataBaseName = "ngFindaSitter"
var sDatabasePath = 'mongodb://127.0.0.1:27017/'


var findSitterApi = require(__dirname + '/api.js')
/** connect to the controller student */

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//    next();
// })


/***** connect to mongodb */

mongo.connect(sDatabasePath, (err, client) => {
  if (err) {
    console.log(chalk.white.bgRed.bold('ERROR 003 -> Cannot connect to the database ' + sDataBaseName))
    return false
  }
  global.db = client.db(sDataBaseName)

  console.log(chalk.white.bgGreen('OK 002 -> Connected to the database ' + sDataBaseName))
  return true
}) 
// ********************************API mongo************************************
app.post('/api/create-user', function (req, res) {
  findSitterApi.createUser(req, res)
  
})

// ********************************API mongo************************************


app.listen(3333)