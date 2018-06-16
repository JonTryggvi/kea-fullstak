const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
const chalk = require('chalk')
const port = process.env.PORT || 1981

// *********************************************GLOBAL VARIABLES********************************************

global.gDb = new sqlite3.Database(`${__dirname}/data.db`)
global.gFs = require('fs')

// ****************************************************************************************************

app.use(express.static(`${__dirname}/public`))

// ****************************************************************************************************
global.gLog = (sStatus, sMessage) => {
  switch (sStatus) {
    case 'ok':
      console.log(chalk.black.bgGreen(sMessage))
      break
    case 'err':
      console.log(chalk.black.bgRed(sMessage))
      break
    case 'ex':
      console.log(chalk.magenta(sMessage))
      break
    case 'info':
      console.log(chalk.blue(sMessage))
      break
  }
}
// ****************************************************************************************************
global.sTopHtmlRam = gFs.readFileSync(`${__dirname}/components/top.html`, 'utf8')
global.sBottomHtmlRam = gFs.readFileSync(`${__dirname}/components/bottom.html`, 'utf8')
global.sFrontHtmlRam = gFs.readFileSync(`${ __dirname }/html/frontpage.html`, 'utf8')
global.sLoginHtmlRam = gFs.readFileSync(`${ __dirname }/html/login.html`, 'utf8')
// const sLoginHtmlRam = gFs.readFileSync(__dirname + '/html/login.html', 'utf8')

// ****************************************************************************************************
const sqlQueries = require(`${__dirname}/controllers/sqlite.js`)

// ***************************************Check if database is populated****************************************

// gDb.all(`SELECT count(*) FROM user_roles`, function (err) {
//   if (err) {
//     sqlQueries.createTable()
//     return false
//   }
//   return true   
// })

// *****************************************Sett routes for Client*****************************************

app.get('/', function (req, res) {
  let sTopHtml = sTopHtmlRam
  sTopHtml = sTopHtml.replace('{{title}}', 'Soberz :: Login')
  sTopHtml = sTopHtml.replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')

  let sLoginHtml = sLoginHtmlRam
  let sBottomHtml = sBottomHtmlRam
  sBottomHtml = sBottomHtml.replace('{{scripts}}', '<script src="/js/login-scripts.js"></script>')
  return res.send(sTopHtml + sLoginHtml + sBottomHtml)
})

app.get('/sober', function (req, res) {
  let sTopHtml = sTopHtmlRam
  sTopHtml = sTopHtml.replace('{{title}}', 'Soberz :: Sober')
  sTopHtml = sTopHtml.replace('{{jt-styles}}', '<link rel="stylesheet" type="text/css" href="/css/styles.css">')
  let sFrontHtml = sFrontHtmlRam
  let sBottomHtml = sBottomHtmlRam
  sBottomHtml = sBottomHtml.replace('{{scripts}}', '<script src="/js/chat-scripts.js"></script>')

  return res.send(sTopHtml + sFrontHtml + sBottomHtml)
}) 

// ****************************************************************************************************
app.get('/get-users', function (req, res) {
  const query = 'SELECT * FROM Users'
  gDb.all(query, function (err, jData) {
    if (err) {
      const jError = {message: err.message, where: 'get-users'}
      gLog('err', `${jError.message} -> in ${jError.where}` )
    }
    return res.json(jData)
  })
  gDb.close()
})
// ****************************************************************************************************



app.listen(port, function (err) {
  if (err) {
    gLog('err', 'could not listen to port ' + port)
  }
  return gLog('ok', 'server running on port ' + port)
      
})   

