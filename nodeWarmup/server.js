var express = require('express')
var app = express()
var chalk = require('chalk')
app.use(express.static(__dirname + '/public'))
global.gFs = require('fs')


// NPM nightmare anybody can publish npm packages

var formidable = require('express-formidable')
app.use(formidable());
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

// ****************************************************************************************************
var user = require( __dirname + '/controllers/user.js' )

// ****************************************************************************************************
var sTopHtml = gFs.readFileSync(__dirname + '/components/top.html', 'utf8')
var sMainHtml = gFs.readFileSync(__dirname + '/html/index.html', 'utf8')
var sBottomHtml = gFs.readFileSync(__dirname + '/components/bottom.html', 'utf8') 

// ****************************************************************************************************
app.get('/', (req, res) => {
  sMainHtml = gFs.readFileSync( __dirname + '/html/index.html', 'utf8' )

  // replace placeholders
  sTopHtml = sTopHtml.replace( '{{title}}', 'PROJECT : : Welcome' )

  sTopHtml = sTopHtml.replace( '{{active-home}}', ' active').replace(/{{active-.*}}/g, '' )
  sBottomHtml = sBottomHtml.replace( '{{js-script}}', '<script src="/js/home.js"></script>' )

  res.send(sTopHtml + sMainHtml + sBottomHtml)
})


app.get('/contact-us', (req, res) => {
  sMainHtml = gFs.readFileSync(__dirname + '/html/contact-us.html', 'utf8')
 
  // replace placeholders
  sTopHtml = sTopHtml.replace('{{title}}', 'PROJECT : : Contact Us')
  sTopHtml = sTopHtml.replace('{{active-contact-us}}', ' active').replace(/{{active-.*}}/g, '')
  sBottomHtml = sBottomHtml.replace('{{js-script}}', '<script src="/js/contact-us.js"></script>' )
  res.send(sTopHtml + sMainHtml + sBottomHtml)
})

app.get('/user-page/:id', (req, res) => {
  var userId = req.params.id; 
  sTopHtml = sTopHtml.replace('{{title}}', 'PROJECT : : Users')
  sTopHtml = sTopHtml.replace('{{active-users}}', ' active').replace(/{{active-.*}}/g, '')
  sBottomHtml = sBottomHtml.replace('{{js-script}}', '')
  sMainHtml = sMainHtml.replace('{{userId}}', userId)
  res.send(sTopHtml + sMainHtml + sBottomHtml)

})




app.get('/test-post', (req, res) => {
 var sName =  req.fields.txtName; // contains non-file fields 
  req.files; // contains files 
  console.log(sName);
  
  return res.send(sName)  // the send should be the last in a route unless for some speciall reasons just use return to be safe
 
  
});

//  ****************************************************************************************************

var port = 1981
app.listen(port, err => {
  if (err) {
    gLog(err, 'cannot use port: '+port)
    return
  }
 
  gLog('ok', 'server is listening on port: '+port)
})
