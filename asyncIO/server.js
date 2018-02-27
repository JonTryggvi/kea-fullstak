var express = require('express')
var app = express()
var chalk = require('chalk')
app.use(express.static(__dirname + '/public'))
global.gFs = require('fs')

var sIndexHtml = gFs.readFileSync(__dirname + '/index.html', 'utf8')


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

  var mainIndexHtml = sIndexHtml
  var sAllLetters = '';
  var iTask = 3
    gFs.readFile(__dirname + '/data-a.txt', 'utf8', (err, sData) => {
      // console.log(sData);
      iTask --
      sLetter = sData
      mainIndexHtml = mainIndexHtml.replace('{{a}}', sLetter)
      sendData(mainIndexHtml)
      
    })
  gFs.readFile(__dirname + '/data-b.txt', 'utf8', (err, sData) => {
      iTask--
      sLetter = sData
      mainIndexHtml = mainIndexHtml.replace('{{b}}', sLetter)
      //  res.send(sMainHtml)
    sendData(mainIndexHtml)
      
     
    })
  gFs.readFile(__dirname + '/data-c.txt', 'utf8', (err, sData) => {
      iTask--
      sLetter = sData
      mainIndexHtml = mainIndexHtml.replace('{{c}}', sLetter)
    sendData(mainIndexHtml)
    })
   
  function sendData(mainIndexHtml) {
    if (iTask == 0) {
      return res.send(mainIndexHtml)
    }
    
   }
    

 

})


//  ****************************************************************************************************

var port = 1983
app.listen(port, err => {
  if (err) {
    gLog(err, 'cannot use port: ' + port)
    return
  }

  gLog('ok', 'server is listening on port: ' + port)
})