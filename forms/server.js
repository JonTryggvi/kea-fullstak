var express = require('express')
var app = express()
var chalk = require('chalk')
//  **************************************************
app.use(express.static(__dirname + '/public'))
//  **************************************************
global.gLog = (sStatus, sMessage) => {
  switch (sStatus) {
    case 'ok':
      console.log(chalk.green(sMessage))
      break
    case 'err':
      console.log(chalk.red(sMessage))
      break
    case 'ex':
      console.log(chalk.magenta(sMessage))
      break
    case 'info':
      console.log(sMessage)
      break
  }
}
//  **************************************************
  
//  **************************************************

//  **************************************************
var port = 1986
app.listen(port, err => {
  if (err) {
    gLog('err', 'Cannot use port: ' + port)
    return
  }
  gLog('ok', 'Server is running on: ' + port)
  
})