var express = require('express');
var app = express();
var chalk = require('chalk');
global.gFs = require('fs');

// store files to RAM
// ****************************************************************************************************

// global functions
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

// routes
//  ****************************************************************************************************
app.get('/write-to-file/:data', (req, res) => {
  try {
    var sParamData = req.params.data;
    let fileA = gFs.readFile(__dirname + '/a.txt', 'utf8', (err, sData) => {
      if (err) {
        gLog('err', 'something went wrong: ' + err)
        return true;
      }
      // console.log(sData)
      gFs.writeFile(__dirname + '/x.txt', sParamData, err => {
        if (err) {
          gLog('err', 'something whent wrong: ' + err)
          return true;
        }
        gLog('ok', 'We wrote that file for ya\'ll!')
      })
      return res.send(sData)
    })
    
  } catch (ex) {
    gLog('err', 'ex server.js - 000 ' + ex)
    var sErrorMessage = 'ex server.js - 000 ' + ex
    
    return res.send(sErrorMessage)
  }
})




// listen to port
//  ****************************************************************************************************
const port = 1980
app.listen(port, err => {
  if (err) {
    gLog(err, 'cannot use port: ' + port)
    return
  }

  gLog('ok', 'server is listening on port: ' + port)
})