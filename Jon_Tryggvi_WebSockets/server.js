var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(3000)
app.use(express.static(__dirname + '/public'))
var gFs = require('fs')
var openUrl = require("openurl")
var chalk = require('chalk')
var formidable = require('express-formidable')
app.use(formidable())


// ****************************************************************************************************
var user = require(__dirname + '/controllers/users.js')

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
      console.log(chalk.cyan(sMessage))
      break
  }
}

// ****************************************************************************************************
var sTopHtmlRam = gFs.readFileSync(__dirname + '/components/top.html', 'utf8')
var sMainHtmlRam = gFs.readFileSync(__dirname + '/html/chat.html', 'utf8')
var sBottomHtmlRam = gFs.readFileSync(__dirname + '/components/bottom.html', 'utf8')
var sLoginHtmlRam = gFs.readFileSync(__dirname + '/html/login.html', 'utf8')

// the database
var sDataFile = __dirname + '/data.txt'
global.sData = gFs.readFileSync(__dirname + '/data.txt', 'utf8')
if (sData.length < 1) {
  sData = '{"users": []}'
  gFs.writeFile(sDataFile, sData, function (err, data) {
    if (err) {
      gLog('err', 'err 01 checkUser -> not able to write user to file ' + err);
      return
    }
    // console.log(data);

  })
}

// ****************************************************************************************************

app.get('/chat', function (req, res) {
  
  var sTopHtml = sTopHtmlRam.replace('{{title}}', 'Chat with : : WebSockets')
  sTopHtml = sTopHtml.replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
  var sMainHtml = sMainHtmlRam
  var sBottomHtml = sBottomHtmlRam.replace('{{js-script}}', '<script src="/js/chat-scripts.js"></script>')
  res.send(sTopHtml + sMainHtml + sBottomHtml);


});

app.get('/', function (req, res) {
  
  var sTopHtml = sTopHtmlRam.replace('{{title}}', 'Login')
  sTopHtml = sTopHtml.replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
  var sLoginHtml = sLoginHtmlRam
  var sBottomHtml = sBottomHtmlRam.replace('{{js-script}}', '<script src="/js/login-scripts.js"></script>')
  res.send(sTopHtml + sLoginHtml + sBottomHtml);
})

// ********************************API************************************
app.post('/logger', function (req, res) {
  //  console.log(req.fields.txtUserName);
   try
  {
    var jCheckUser = {}
    jCheckUser.name = req.fields.txtUserName
    jCheckUser.psw = req.fields.txtUserPsw
    var checkForUser = []
    user.checkUser(sDataFile, jCheckUser, (err, sData) => {
      if (err) {
        console.log(err);
      }
      // console.log(sData);
      checkForUser.push(sData)
      return sData
    })  
    // console.log(checkForUser[0][0]);
    
    if (checkForUser[0][0] == false) {
      var aAllowCharacters = "1234567890ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
      function getRandomRange(min, max) {
        // return Math.random() * (max - min) + min
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      function getUniqueId() {
        // a random string of 64 alpanumeric characters
        var iRandomNumber;
        var id;
        var sUniqueId = 'userId_';
        for (var i = 0; i < 32; i++) {
          // console.log(aAllowCharacters[i]);
          iRandomNumber = getRandomRange(0, aAllowCharacters.length);
          sUniqueId += aAllowCharacters[iRandomNumber];
        }
        return sUniqueId;
      } 
      var newUser = {}
      newUser.name = req.fields.txtUserName
      newUser.psw = req.fields.txtUserPsw
      newUser.id = getUniqueId();
      newUser.active = true
      newUser.messages = []
      var newSavedUser = user.saveUser(sDataFile, newUser, function(err, data) {
        if (err) {
          console.log(err);
        }
        checkForUser[0].splice(1);
        checkForUser[0].push(data)
      }) 
     } 
     
    res.send(checkForUser)
  }
    catch (err)
   {
     var error = { "message": 'User error 002 -> ', "chatch": err}
     gLog('err', error.message + error.chatch)
     res.send(error);
  } 
})

app.post('/logout', function (req, res) {
  var userId = req.fields.userId
  user.logOut(sDataFile, userId, function (err, data) {
    if (err) {
      console.log(err);
    }
    return res.send(true)
  })
})




// ********************************Socets************************************

io.on('connection', function (socket) {
  try {
    // console.log(socket.id);
  
    var ajActiveUsers = user.getActiveUsers()
    var clientUserId = []
    var clientUserData = {}
    var userData
    gLog('info', 'a User Connected')
    // io.sockets.emit('activeUsers', { "activeUsers": user.getActiveUsers()})
    socket.on('whatBrowser', function (jData) {
      // console.log(jData);
      clientId = jData.userId;
      // console.log(clientId);
      clientUserId.push(clientId)
      clientuserData = user.getUserById(clientId)  
      io.sockets.emit('activeUsers', { "activeUsers": clientuserData })
    })
    socket.emit('isConnected', { "status": "ok" })
    // console.log(clientUserId);
    
    
    socket.on('grabbMessage', function (jData) {
      var userName = user.getUserById(jData.userId)
      // console.log(userName);
      jData.userName = userName.name
      
      socket.emit('chat', jData)
      socket.broadcast.emit('chat', jData)
    })
    socket.on('disconnect', function (jData) { 
      // console.log(jData);
      // io.sockets.emit('activeUsers', { "activeUsers": user.getActiveUsers() })
    });
  } catch (err) {
    gLog('err', 'io connection something went wrong '+ err.message)
    // var getAwnsers = "https://stackoverflow.com/search?q=[js]+" + err.message
    // openUrl.open(getAwnsers)
  }
})

// http.listen(3000);
http.listen(80, function () {
  try {
    // console.log('server is running')
    gLog('ok', 'server is running')
  } catch (err) {
    // console.log('server could not run on port 3333' + err.message)
    gLog('err', 'server could not run on port 3333' + err.message)
  }
  
})


