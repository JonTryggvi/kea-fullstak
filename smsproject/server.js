var express = require('express')
var app = express()
var mysql = require('mysql')
var gFs = require('fs')
var bodyParser = require('body-parser')
global.crypto = require('crypto');
// global.openUrl = require("openurl")
app.use(express.static(__dirname + '/public'))
// create application/json parser
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// ****************************************************************************************************

global.db = mysql.createConnection({
  host: 'localhost',
  port: '8889',
  user: 'root',
  password: 'root',
  database: 'sms' 
});
db.connect();

// ****************************************************************************************************
global.sTopHtmlRam = gFs.readFileSync(__dirname + '/components/top.html', 'utf8')
global.sSignUpBodyHtmlRam = gFs.readFileSync(__dirname + '/html/signup.html', 'utf8')
global.sValidatedBodyHtmlRam = gFs.readFileSync(__dirname + '/html/valid.html', 'utf8')
global.sBottomHtmlRam = gFs.readFileSync(__dirname + '/components/bottom.html', 'utf8')
// global.sLoginHtmlRam = gFs.readFileSync(__dirname + '/html/login.html', 'utf8')
// ****************************************************************************************************

var signup = require(__dirname + '/controllers/signup.js')
var validUser = require(__dirname + '/controllers/valid-user.js')

// ****************************************************************************************************
var user = require(__dirname + '/controllers/user.js')
// ****************************************************************************************************

app.get('/sign-up', signup)
app.get('/valid-user', validUser)

// ******************************************API*************************************
app.post('/save-user', urlencodedParser, (req, res) => {
  user.saveUser(req, res)
})
app.post('/validate-code', urlencodedParser, (req, res) => {
  user.validateUser(req, res)
})

app.get('/test', (req, res) => {
  user.test()
})

// ****************************************************************************************************

app.listen(1980, function (err) {
  if (err) {
    console.log('could not connect to port 80')
    return
  }
  console.log('SERVER RUNNING ON PORT 80')
}) 