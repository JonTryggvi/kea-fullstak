var express = require('express')
var app = express()
var chalk = require('chalk')
app.use(express.static(__dirname + '/public'))
global.gFs = require('fs')

var sIndexHtml = gFs.readFileSync(__dirname + '/html/index.html', 'utf8')


// console.log(aMainData)
// ****************************************************************************************************
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

//  ****************************************************************************************************
app.get('/', (req, res) => {
  try {
    gFs.readFile(__dirname + '/data.txt', 'utf8', (err, sData) => {
      var sName =sData[1].name
      console.log(sName)
      var sMainHtml = sIndexHtml
      sMainHtml = sMainHtml.replace('{{title}}', sName)
      return res.send(sMainHtml)
     })
   
    
  } catch (ex) {
    gLog('err','ex server.js - 000 ' + ex)
    var sErrorMessage = 'ex server.js - 000 ' + ex
    sMainHtml = sMainHtml.replace('{{title}}', sErrorMessage)
    return res.send(sMainHtml)
  }
  
})

//  ****************************************************************************************************

var port = 1982
app.listen(port, err => {
  if (err) {
    gLog(err, 'cannot use port: ' + port)
    return
  }

  gLog('ok', 'server is listening on port: ' + port)
})