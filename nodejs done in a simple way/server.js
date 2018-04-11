var express = require('express')
var app = express()

var signup = require( __dirname + '/controllers/signup.js' )

app.get( '/sign-up', signup(req, res))


app.listen(80, err => {
  console.log('SERVER LISTENING ON PORT 80')
})

smses.io
