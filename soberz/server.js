const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(3000)
const sqlite3 = require('sqlite3')
const chalk = require('chalk')
// const bodyParser = require('body-parser')
const formidable = require('express-formidable')
const path = require('path')
const port = process.env.PORT || 1981
// *********************************************GLOBAL VARIABLES***************************************

global.gDb = new sqlite3.Database(`${__dirname}/data.db`)
global.gFs = require('fs')
global.appDir = path.dirname(require.main.filename)


// ****************************************************************************************************

app.use(express.static(`${__dirname}/public`))
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(formidable())
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
// components
global.sTopHtmlRam    = gFs.readFileSync(`${__dirname}/components/top.html`, 'utf8')
global.sBottomHtmlRam = gFs.readFileSync(`${__dirname}/components/bottom.html`, 'utf8')
global.sNavInHtmlRam  = gFs.readFileSync(`${__dirname }/components/nav-in.html`, 'utf8')
global.sNavOutHtmlRam = gFs.readFileSync(`${__dirname}/components/nav-out.html`, 'utf8')
global.stableHtmlRam = gFs.readFileSync(`${__dirname}/components/table.html`, 'utf8')
//  pages
global.sFrontHtmlRam  = gFs.readFileSync(`${__dirname}/html/frontpage.html`, 'utf8')
global.sChatHtmlRam   = gFs.readFileSync(`${__dirname}/html/chat.html`, 'utf8')
global.sLoginHtmlRam  = gFs.readFileSync(`${ __dirname }/html/login.html`, 'utf8')
global.sUsersHtmlRam  = gFs.readFileSync(`${ __dirname }/html/users.html`, 'utf8')
global.sSignupHtmlRam = gFs.readFileSync(`${ __dirname }/html/signup.html`, 'utf8')
global.sAboutHtmlRam = gFs.readFileSync(`${ __dirname }/html/about.html`, 'utf8')

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
  let sNavHtml = sNavOutHtmlRam.replace(/{{logLink}}/g, '<a href="/signup">Sign up</a>').replace(/{{about}}/g, '<a href="/about">About</a>')
  let sTopHtml = sTopHtmlRam
  sTopHtml = sTopHtml.replace('{{title}}', 'Soberz :: Login')
  .replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
  .replace('{{header}}', sNavHtml)
  let sLoginHtml = sLoginHtmlRam
  let sBottomHtml = sBottomHtmlRam
  sBottomHtml = sBottomHtml.replace('{{scripts}}', '<script src="/js/login-scripts.js"></script>')
  return res.send(sTopHtml + sLoginHtml + sBottomHtml)
})

fronEndRoutes.get('/about', function (req, res) {
  let sNavHtml = sNavOutHtmlRam.replace(/{{logLink}}/g, '<a href="/signup">Sign up</a>').replace(/{{about}}/g, '<a href="/about">About</a>')
  let sTopHtml = sTopHtmlRam
  sTopHtml = sTopHtml.replace('{{title}}', 'Soberz :: About')
    .replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
    .replace('{{header}}', sNavHtml)
  let sAboutHtml = sAboutHtmlRam
  let sBottomHtml = sBottomHtmlRam
  sBottomHtml = sBottomHtml.replace('{{scripts}}', '<script src="/js/login-scripts.js"></script>')
  return res.send(sTopHtml + sAboutHtml + sBottomHtml)
})

fronEndRoutes.get('/about/:id', function (req, res) {
  var userId = req.params.id
  let sNavHtml = sNavInHtmlRam.replace(/{{userId}}/g, userId)
  let sTopHtml = sTopHtmlRam
  sTopHtml = sTopHtml.replace('{{title}}', 'Soberz :: About')
    .replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
    .replace('{{header}}', sNavHtml)
  let sAboutHtml = sAboutHtmlRam
  let sBottomHtml = sBottomHtmlRam
  sBottomHtml = sBottomHtml.replace('{{scripts}}', '<script src="/js/login-scripts.js"></script>')
  return res.send(sTopHtml + sAboutHtml + sBottomHtml)
})

fronEndRoutes.get('/signup', function (req, res) {
  let sNavHtml = sNavOutHtmlRam.replace(/{{logLink}}/g, '<a href="/">Login</a>').replace(/{{about}}/g, '<a href="/">About</a>')
  let sTopHtml = sTopHtmlRam
  sTopHtml = sTopHtml.replace('{{title}}', 'Soberz :: Signup')
    .replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
    .replace('{{header}}', sNavHtml)
  let sSignupHtml = sSignupHtmlRam
  let sBottomHtml = sBottomHtmlRam
  sBottomHtml = sBottomHtml.replace('{{scripts}}', '<script src="/js/signup-scripts.js"></script>')
  return res.send(sTopHtml + sSignupHtml + sBottomHtml)
})

fronEndRoutes.get('/sober', function (req, res) {
  return res.redirect('/')
})
fronEndRoutes.get('/sober/:id', function (req, res) {
  let userId = req.params.id
  if (userId) {
    let sNavHtml = sNavInHtmlRam.replace(/{{userId}}/g, userId)
    let sTopHtml = sTopHtmlRam
    sTopHtml = sTopHtml.replace('{{title}}', 'Soberz :: Sober')
      .replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
      .replace('{{header}}', sNavHtml)
    let sFrontHtml = sFrontHtmlRam
    let sBottomHtml = sBottomHtmlRam
    sBottomHtml = sBottomHtml.replace('{{scripts}}', '<script src="/js/profile-scripts.js"></script>')
    return res.send(sTopHtml + sFrontHtml + sBottomHtml) 
  } 
}) 

fronEndRoutes.get('/chat', function(req, res){
  return res.redirect('/')
})

fronEndRoutes.get('/chat/:id', function (req, res) {
  let userId = req.params.id
  if (userId) {
    let userId = req.params.id
    let sNavHtml = sNavInHtmlRam.replace(/{{userId}}/g, userId)
    let sTopHtml = sTopHtmlRam
    sTopHtml = sTopHtml.replace('{{title}}', 'Soberz :: Chat')
      .replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
      .replace('{{header}}', sNavHtml)
    let sChatHtml = sChatHtmlRam
    let sBottomHtml = sBottomHtmlRam
    sBottomHtml = sBottomHtml.replace('{{scripts}}', '<script src="/js/chat-scripts.js"></script>')
    return res.send(sTopHtml + sChatHtml + sBottomHtml)
  } 
})

fronEndRoutes.get('/users', function (req, res) {
  return res.redirect('/')
})

fronEndRoutes.get('/users/:id', function (req, res) {
  let userId = req.params.id
  userQueris.getUsers(req, res, function (err, ajUserData) {
    if (err) {
      return false
    }
    // console.log(ajUserData);
    let jUser
    let sHtmlUser = ''
    let sFirstName = ''
    let sLastName = ''
    let sEmail = ''
    let sMobile = ''
    let sGender = ''
    let sRole = ''
    let sUserId = ''
    let sSponsor = ''
    let isAdmin = ajUserData.filter(x => x.id == userId)[0].role == 'Admin' ? true : false
    let sTableHead = isAdmin ? 
      `<tr>
        <th>Name</th>
        <th>email</th>
        <th>mobile #</th>
        <th>Role</th>
        <th>Gender</th>
        <th>Is Sponsor</th>
        <th>delete</th>
      </tr>` : 
      `<tr>
        <th>Name</th>
        <th>email</th>
        <th>mobile #</th>
        <th>Role</th>
        <th>Gender</th>
        <th>Is Sponsor</th>
      </tr>`
    
    for (let i = 0; i < ajUserData.length; i++) {
      jUser      = ajUserData[i]
      sFirstName = jUser.firstname
      sLastName  = jUser.lastname 
      sEmail = jUser.email
      sMobile = jUser.mobile
      sGender = jUser.gender
      sRole = jUser.role 
      sUserId = jUser.id
      sSponsor = jUser.sponsor == '1' ? 'Yes' : 'Not yet'
      sHtmlUser += isAdmin ? `<tr>
                      <td>${sFirstName} ${sLastName}</td>
                      <td>${sEmail}</td>
                      <td>${sMobile}</td>
                      <td data-target="modal" class="modal-trigger modalClick" data-userid="${sUserId}">${sRole}</td>
                      <td>${sGender}</td>
                      <td>${sSponsor}</td>
                      <td><button data-userid="${sUserId}" class="btn-floating btnDeleteUser btn-small waves-effect waves-light red lighten-2"><i class="material-icons">clear</i></button></td>
                    </tr>` :
                    `<tr>
                      <td>${sFirstName} ${sLastName}</td>
                      <td>${sEmail}</td>
                      <td>${sMobile}</td>
                      <td>${sRole}</td>
                      <td>${sGender}</td>
                      <td>${sSponsor}</td>
                    </tr >`
        
    }
    let sNavHtml = sNavInHtmlRam.replace(/{{userId}}/g, userId)
    let sTopHtml = sTopHtmlRam
    sTopHtml = sTopHtml.replace('{{title}}', 'Soberz :: Users')
      .replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
      .replace('{{header}}', sNavHtml)
    let sTableHtml = stableHtmlRam.replace('{{usersHead}}', sTableHead).replace('{{users}}', sHtmlUser)
    let sUsersHtml = sUsersHtmlRam.replace('{{table}}', sTableHtml)
    let sBottomHtml = sBottomHtmlRam
    sBottomHtml = sBottomHtml.replace('{{scripts}}', '<script src="/js/users-scripts.js"></script>')
    return res.send(sTopHtml + sUsersHtml + sBottomHtml)
  });
})

// ****************************************************************************************************
const apiRoutes = express.Router()

apiRoutes.post('/login', function (req, res) {
  userQueris.login(req, res);
})

apiRoutes.post('/logout', function (req, res) {
  userQueris.logoutUser(req, res)
})

apiRoutes.post('/get-loggedin-user', function (req, res) {
  userQueris.getThisUser(req, res)
})


apiRoutes.get('/get-users', function (req, res) {
  userQueries.getUsers(req, res)
  // gDb.close()
})

apiRoutes.get('/get-genders', function (req, res) {
  userQueris.getGenders(req, res);
})

apiRoutes.post('/update-user', function (req, res) {
  userQueris.updateUserbyField(req, res)
})

apiRoutes.post('/save-user', function (req, res) {
  userQueris.saveUser(req, res)
})

apiRoutes.get('/auth-signin/:code', function (req, res) {
  userQueris.authSignin(req, res)
})
apiRoutes.post('/delete-user', function (req, res) {
  userQueris.deleteUser(req, res)
})

apiRoutes.post('/update-user-img', function (req, res) {
  userQueris.updateUserImg(req , res)
  
});


app.use('/api', apiRoutes)
// ****************************************************************************************************

var numUsers = 0;
var aConnected = [];
io.on('connection', (socket) => {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username
    
    ++numUsers;
    aConnected = [... aConnected, { username: socket.username, socketId: socket.id}]
    addedUser = true;
    socket.emit('login', {
      socketId: socket.id,
      username: socket.username,
      numUsers: numUsers,
      allUsers: aConnected
     
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      socketId: socket.id,
      username: socket.username,
      numUsers: numUsers,
      allUsers: aConnected
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;
      aConnected = aConnected.filter(x => x.socketId !== socket.id)
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        socketId: socket.id,
        username: socket.username,
        numUsers: numUsers,
        allUsers: aConnected
        // online:io.sockets.clients()
      });
    }
  });
});

// ****************************************************************************************************

http.listen(port, function (err) {
  if (err) {
    return gLog('err', 'could not listen to port ' + port)
  }
  return gLog('ok', 'server running on port ' + port)
      
})   

