var express = require('express')
var app = express()
var chalk = require('chalk')

//  *****



//  *****
//  global log state function
 global.gLog = (sStatus, sMessage) => {
  switch (sStatus) {
    case 'ok':
      console.log(chalk.green(sMessage))  
      break;  
    case 'err':
      console.log(chalk.red(sMessage))   
      break;  
    case 'ex':
      console.log(chalk.magenta(sMessage))   
      break;  
    case 'info':
      console.log(sMessage)   
      break;  
  }
 }
//  *****
var user = require(__dirname + '/controllers/user')

//  *****

app.listen(1981, err => {
  if (err) {
    gLog(err, 'cannot use that port')
    return
  }
 
  gLog('ok', 'server is listening on port 1981')
})
