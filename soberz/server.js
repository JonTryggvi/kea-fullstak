const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
const chalk = require('chalk')
const bodyParser = require('body-parser');
const port = process.env.PORT || 1981
// *********************************************GLOBAL VARIABLES***************************************

global.gDb = new sqlite3.Database(`${__dirname}/data.db`)
global.gFs = require('fs')

// ****************************************************************************************************

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

global.sTopHtmlRam    = gFs.readFileSync(`${__dirname}/components/top.html`, 'utf8')
global.sBottomHtmlRam = gFs.readFileSync(`${__dirname}/components/bottom.html`, 'utf8')
global.sFrontHtmlRam  = gFs.readFileSync(`${ __dirname }/html/frontpage.html`, 'utf8')
global.sLoginHtmlRam  = gFs.readFileSync(`${ __dirname }/html/login.html`, 'utf8')
// const sLoginHtmlRam = gFs.readFileSync(__dirname + '/html/login.html', 'utf8')

// ****************************************************************************************************

const sqlQueries = require(`${__dirname}/controllers/sqlite.js`)
const userQueris = require(`${__dirname}/controllers/users.js`)

// ***************************************Check if database is populated*******************************

gDb.all(`SELECT count(*) FROM user_roles`, function (err) {
  if (err) {
    sqlQueries.createTable()
    return false
  }
  return true   
})

// *****************************************Sett routes for Client*************************************
const fronEndRoutes = express.Router()
app.use('/', fronEndRoutes)
fronEndRoutes.get('/', function (req, res) {
  let sTopHtml = sTopHtmlRam
  sTopHtml = sTopHtml.replace('{{title}}', 'Soberz :: Login')
  .replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
  .replace('{{header}}', '<nav id="headerNav"></nav>')
  let sLoginHtml = sLoginHtmlRam
  let sBottomHtml = sBottomHtmlRam
  sBottomHtml = sBottomHtml.replace('{{scripts}}', '<script src="/js/login-scripts.js"></script>')
  return res.send(sTopHtml + sLoginHtml + sBottomHtml)
})

fronEndRoutes.get('/sober/:id', function (req, res) {
  
  if (req.params.id){
    let sTopHtml = sTopHtmlRam
    sTopHtml = sTopHtml.replace('{{title}}', 'Soberz :: Sober')
      .replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
      .replace('{{header}}', '<nav id="headerNav"></nav>')
    let sFrontHtml = sFrontHtmlRam
    let sBottomHtml = sBottomHtmlRam
    sBottomHtml = sBottomHtml.replace('{{scripts}}', '<script src="/js/profile-scripts.js"></script>')
    return res.send(sTopHtml + sFrontHtml + sBottomHtml) 
  } else {
    return res.redirect('/')
  }

}) 

// ****************************************************************************************************
const apiRoutes = express.Router()

apiRoutes.post('/login', function (req, res) {
  userQueris.login(req, res);
})

apiRoutes.post('/get-loggedin-user', function (req, res) {
  userQueris.getThisUser(req, res)
})


apiRoutes.get('/get-users', function (req, res) {
  const query = 'SELECT * FROM Users'
  gDb.all(query, function (err, jData) {
    if (err) {
      const jError = {message: err.message, where: 'get-users'}
      gLog('err', `${jError.message} -> in ${jError.where}` )
    }
    return res.json(jData)
  })
  // gDb.close()
})


app.use('/api', apiRoutes)
// ****************************************************************************************************



app.listen(port, function (err) {
  if (err) {
    gLog('err', 'could not listen to port ' + port)
  }
  return gLog('ok', 'server running on port ' + port)
      
})   

