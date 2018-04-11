var express = require('express')
var app = express()


var cUser = require(__dirname+ '/controllers/user.js')


app.get('/get-user-name', (req, res) => {
  
  
  
  // cUser.getUserName((err, sUserName) => {
  //   if (err) {
  //     console.log('err');
  //     return res.send('error')
  //   }
  //   return res.send(sUserName)
  // })
})

app.listen(80, function () {
  console.log('server connected on port 80');
  
})