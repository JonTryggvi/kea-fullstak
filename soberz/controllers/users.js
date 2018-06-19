const bcrypt = require('bcrypt-nodejs')
const moment = require('moment')
const time = moment()
const time_format = time.format('YYYY-MM-DD HH:mm:ss Z')
const request = require('request')
const path = require('path')
const nodemailer = require('nodemailer')
global.serverpath = ''
// ****************************************************************************************************
sendSmsData = function (req, res, userData) {
  try {
    const sMobile = userData[2]
    let sMobielNoCode = '';
    if (sMobile.length > 8) {
      sMobielNoCode = sMobile.substring(3)
    } else {
      sMobielNoCode = sMobile
    }
    
    
    const iMobile = Number(sMobielNoCode)
    const userName = userData[1]
    const sMessage = `Welcome to Soberz ${userName}! Click to activate:${serverpath}/api/auth-signin/${userData[0]}`
    const apiToken = '$2y$10$.ChyTpLaho/NlaEFtu7bMebks1C/Q.yn6/JTJ6WaTZRHGMjMnQTCq';
    
    request.post({
      url: 'http://smses.io/api-send-sms',
      form: {
        apiToken: apiToken,
        mobile: iMobile,
        message: sMessage,
      }
    },
      function (err, httpResponse, body) {
        console.log(body)
        if (err) {
          return false
        }
        return true;
      })
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> sendSmsData stand alone function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

function random4Digit() {
  return shuffle("0123456789".split('')).join('').substring(0, 4);
}
function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
// ****************************************************************************************************
const jUser = {}

jUser.login = function (req, res) {
  const password = req.fields.password 
  const email = req.fields.email
  const stmt = "SELECT Users.id, Users.firstname, Users.lastname, Users.activated, Users.online, user_roles.role_name FROM Users INNER JOIN user_roles ON Users.user_role = user_roles.role_id  WHERE (email = $auth OR mobile = $auth) AND password = $pass AND activated = 1"
  const params = {
    $auth: email,
    $pass: password
  }
  gDb.get(stmt, params, function (err, jRow) {
    if (err) {
      const jError = { message: 'update User login error: ' + err, where: 'update online status -> loginUser function: 1' }
      gLog('err', jError.message + ' -> ' + jError.where)
      const sjError = JSON.stringify(jError)
      return res.json(sjError)
    }
    if (jRow == undefined) {
      return res.json({status: 'failed', message: 'You either provided a wrong email/mobile or password'})
    }
    gDb.run('UPDATE Users SET online = ? WHERE Users.id = ?', [1, jRow.id], function (err) {
      if (err) {
        jError = { message: 'update User set online error: ' + err, where: 'update online status -> loginUser function: 2' }
        gLog('err', jError.message + ' -> ' + jError.where)
        return res.json(jError)
      }
      const jRes = { status: 'ok', message: 'User added', response: jRow }
      return res.json(jRes)
    })
  
  })
  // gDb.close() 
}

jUser.logoutUser = function (req, res) {
  try {
    const userId = req.fields.id
    gDb.run('UPDATE Users SET online = ? WHERE Users.id = ?', [0, userId], function (err) {
      if (err) {
        console.log(err);
        jError = { message: 'update user set ofline error: ' + err, where: 'update online status -> logoutUser function' }
        gLog('err', jError.message + ' -> ' + jError.where)
        return res.send({ status: 'failed' })
      }

      return res.send({ status: 'ok', id: userId })
    })
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> logoutUser function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

jUser.getThisUser = function (req, res) {
  const userId = req.fields.userId
  const stmt = "SELECT about, json_extract(a.imgUrl, '$') AS userImg, json_extract(a.sponsors, '$') AS sponsors, json_extract(a.sponsees, '$') AS sponsees, a.id, a.email, a.firstname, a.lastname, a.mobile, a.sponsor, a.username, a.online, a.activated, b.gender_name AS gender, c.role_name AS role FROM Users AS a INNER JOIN genders  AS b ON (a.gender = b.id) INNER JOIN user_roles AS c ON (a.user_role = c.role_id) WHERE a.activated = 1 AND a.id = ?"
  gDb.all(stmt, [userId], function (err, jRow) {
    if (err) {
      const jError = { success: 'failed', message: 'Get logged in User error: ' + err, where: 'controllers/user.js -> getThisUser function' }
      gLog('err', jError.message + ' -> ' + jError.where)
      const sjError = JSON.stringify(jError)
      return res.json(sjError)
    }
    const jRes = { success:'ok', message: 'ok', response: jRow[0] }
    return res.json(jRes)
  })
}

jUser.getGenders = function (req, res) {
  const stmt = "SELECT * FROM genders"
  gDb.all(stmt, function (err, jRow) {
    if (err) {
      const jError = {success: 'ok', message: 'Get gendeer in User error: ' + err, where: 'controllers/user.js -> getGender function' }
      gLog('err', jError.message + ' -> ' + jError.where)
      return res.json(jError)
    }
    const jRes = { success: 'ok', message: 'ok', response: jRow }
    return res.json(jRes)
  })
}

jUser.updateUserbyField = function (req, res) {
  try {
    // console.log(req.fields);
    const columnName = req.fields.name
    let dataValue = req.fields.value
    const userId = Number(req.fields.userId)
    if (columnName == 'user_role') {
      dataValue = Number(dataValue);
      // console.log(dataValue, columnName, userId);
    }
    const stmt = 'UPDATE Users SET ' + columnName + ' = ? WHERE Users.id = ?';
    const params = [dataValue, userId]


    gDb.run(stmt, params, function (err) {
      if (err) {
        const jError = { status: 'failed', message: 'updateUserbyField query failed ' + err }
        return res.json(jError)
      }
      let dataValueChecked;
      if (isJson(dataValue)) {
        dataValueChecked = JSON.parse(dataValue);
      } else {
        dataValueChecked = dataValue
      }
      const jSuccess = { status: 'ok', message: 'Userfield: ' + columnName + ' has been updateed', updatedData: { name: columnName, userId: userId, value: dataValueChecked } }
      return res.json(jSuccess)
     
    })
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> updateUserByField function' }
    gLog('err', err.message + ' -> ' + err.where)
    return res.json(err)
    
  }
}

jUser.updateUserImg = function (req, res) {
  try {
    serverpath = req.protocol + '://' + req.get('host');
    const old_path = req.files.userImg.path
    const file_size = req.files.userImg.size
    const file_ext = req.files.userImg.name.split('.').pop()
    const index = old_path.lastIndexOf('/') + 1
    const file_name = old_path.substr(index)
    const new_path = path.join(process.env.PWD, 'public/uploads/img/', file_name + '.' + file_ext)
    let sjFileData = req.fields
    const jFileData = JSON.parse(sjFileData.formData)
    const prevFile = jFileData.fileToDelete
    const userId = Number(jFileData.id)
    const userName = jFileData.userName
    //  perhaps try with async await or promise methood
    gFs.readFile(old_path, function (err, data) {
      if (err) {
        const error = { message: err.message, where: 'controllers/users.js -> update img saveFile entering callback hell' }
        gLog('err', error.message + ' -> ' + error.where)
        return false;
      }
      gFs.writeFile(new_path, data, function (err) {
        if (err) {
          const error = { message: err.message, where: 'controllers/users.js -> update img saveFile -> writefile ' }
          gLog('err', error.message + ' -> ' + error.where)
          return false;
        }
        const imgPath = '/uploads/img/' + file_name + '.' + file_ext
        const sjUserImg = `{ "imgPath":  "${imgPath}", "imgId": "${file_name}"}`
        const aParams = [sjUserImg, userId]
        stmt = 'UPDATE Users SET imgUrl = ? WHERE id = ?'
        gDb.run(stmt, aParams, function (err, data) {
          if (err) {
            const error = { success: false, message: err.message, where: 'controllers/users.js -> saveUser db query' }
            gLog('err', error.message + ' -> ' + error.where)
            return res.send(error)
          }
          try {
            gFs.unlink('./public' + prevFile, (err) => {
              if (err) {
                const error = { success: false, message: err.message, where: 'controllers/users.js -> saveFile -> writefile -> unlink -> unlink' }
                gLog('err', error.message + ' -> ' + error.where)
              }
              const jSuccess = { status: 'ok', message: 'Great ' + userName +' img has been updated' }
              return res.send(jSuccess)
            })
          } catch (error) {
            const jErr = { status: 'failed', message: error.message, where: ' controllers/users.js ->  updateUserImg function' }
            gLog('err', jErr.message + ' -> ' + jErr.where)
            return res.send(jErr)
          }
        })
      })
    })
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> updateUserByField function' }
    gLog('err', err.message + ' -> ' + err.where)
    return res.json(err)
  }
}

jUser.getUsers = function (req, res, fCallback) {
  const query = `SELECT about, json_extract(a.imgUrl, '$') AS userImg, json_extract(a.sponsors, '$') AS sponsors, json_extract(a.sponsees, '$') AS sponsees, a.id, a.email, a.firstname, a.lastname, a.mobile, a.sponsor, a.username, a.online, a.activated, b.gender_name AS gender, c.role_name AS role FROM Users AS a INNER JOIN genders  AS b ON (a.gender = b.id) INNER JOIN user_roles AS c ON (a.user_role = c.role_id) WHERE a.activated = 1`
  gDb.all(query, function (err, jData) {
    if (err) {
      const jError = { message: err.message, where: 'get-users' }
      gLog('err', `${jError.message} -> in ${jError.where}`)
      return fCallback(true, jError)
    }
    return fCallback(false, jData)
  })
}

jUser.saveUser = function (req, res) {
  try {
    serverpath = req.protocol + '://' + req.get('host');
    const old_path = req.files.userImg.path
    const file_size = req.files.userImg.size
    const file_ext = req.files.userImg.name.split('.').pop()
    const index = old_path.lastIndexOf('/') + 1
    const file_name = old_path.substr(index)
    const new_path = path.join(process.env.PWD, 'public/uploads/img/', file_name + '.' + file_ext)
    const prevFile = req.fields.oldFile
    // console.log(prevFile);
    //  perhaps try with async await or promise methood
    gFs.readFile(old_path, function (err, data) {
      if (err) {
        const error = { message: err.message, where: 'controllers/users.js -> saveFile entering callback hell' }
        gLog('err', error.message + ' -> ' + error.where)
        return false;
      }
      gFs.writeFile(new_path, data, function (err) {
        if (err) {
          const error = { message: err.message, where: 'controllers/users.js -> saveFile -> writefile ' }
          gLog('err', error.message + ' -> ' + error.where)
          return false;
        }
        const imgPath = '/uploads/img/' + file_name + '.' + file_ext
        const success = { 'success': true, 'imgPath': imgPath, 'imgId': file_name }
        const code = random4Digit()
        const sUserData = req.fields.formData
        const jUserData = JSON.parse(sUserData)
        let sMobile = jUserData.mobile
        // console.log(sMobile);
        const sUserName = jUserData.firstname+ ' '+ jUserData.lastname
        const sjUserImg = `{ "imgPath":  "${imgPath}", "imgId": "${file_name}"}`
        const sIsSponsor = jUserData.isSponsor === 'on' ? '1' : '0'
        const aParams = [jUserData.firstname, jUserData.lastname, sUserName, jUserData.email, sMobile, jUserData.gender, sIsSponsor, sjUserImg, jUserData.password, time_format, code]
        stmt = 'INSERT INTO Users (firstname, lastname, username, email, mobile, gender, sponsor, imgUrl, password, date, code ) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        gDb.run(stmt, aParams, function (err, data) {
          if (err) {
            const error = { success: false, message: err.message, where: 'controllers/users.js -> saveUser db query' }
            gLog('err', error.message + ' -> ' + error.where)
            return res.send(error)
          }
          try {
            nodemailer.createTestAccount((err, account) => {
              if (err) {
                console.log(err)
                return false
              }
              let transporter = nodemailer.createTransport({
                host: 'mail.1984.is',
                port: 587,
                secure: false,
                auth: {
                  user: 'jontryggvi@jontryggvi.is',
                  pass: 'BFs1qiCpF"vz*v6e-mr'
                }
              })
              let mailOptions = {
                from: '"Soberz"<jontryggvi@jontryggvi.is>',
                to: jUserData.email,
                subject: 'howdy ' + jUserData.firstname,
                text: 'Hi, ' + jUserData.firstname + ' please click the link to activate your account. You will be sent to the login page',
                html: '<p>Hi, ' + jUserData.firstname + ' please click the link to activate your account. You will be sent to the login page</p><a href="' + serverpath + '/api/auth-signin/' + code + '">Activate account</a>'
              }

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return console.log(error)
                }
                gLog('info', 'message sent: %s', info.messageId)
                gLog('info', 'Preview URL: %s', nodemailer.getTestMessageUrl(info))
              })
            })
            sendSmsData(req, res, [code, jUserData.firstname, sMobile])
            const jSuccess = { status: 'ok', message: 'user: ' + jUserData.username + ' has been added' }
            return res.send(jSuccess)

          } catch (error) {
            const jErr = { status: 'failed', message: error.message, where: ' controllers/users.js -> saveUser function' }
            gLog('err', jErr.message + ' -> ' + jErr.where)
            return res.send(jErr)
          }
        })
      });
    });
  } catch (error) {
    const err = { message: error.message, where: 'controllers/users.js -> saveFile function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

jUser.authSignin = function (req, res) {
  try {
    serverpath = req.protocol + '://' + req.get('host');
    const code = req.params.code
    const activated = 1
    const stmt = 'UPDATE Users SET activated = ? WHERE code = ?'
    const params = [activated, code]
    gDb.run(stmt, params, function (err, dbResponse) {
      if (err) {
        return res.send({ status: 'failed' })
      }
      gLog('ok', 'user Activated')
      // console.log(serverpath);
      return res.redirect(serverpath)
    })
  } catch (error) {
    const err = { message: error.message, where: ' controllers/users.js -> authSignin function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

jUser.deleteUser = function (req, res) {
  const userId = req.fields.userId
  try {
    const stmt = "SELECT json_extract(imgUrl, '$') AS imgUrl FROM Users WHERE id = ?"
    const params = userId
    gDb.all(stmt, params, function (err, jRow) {
      if (err) {
        const error = { success: false, message: err.message, where: 'controllers/users.js -> delete userfiles standalone function' }
        gLog('err', error.message + ' -> ' + error.where)
        return false
      }
      const imgObj = JSON.parse(jRow[0].imgUrl);
      const imgPath = imgObj.imgPath
      gFs.unlink('./public' + imgPath, (err) => {
        if (err) {
          const error = { success: false, message: err.message, where: 'controllers/users.js -> saveFile -> writefile -> unlink -> unlink' }
          gLog('err', error.message + ' -> ' + error.where)
        }
        const stmt = 'DELETE FROM Users WHERE id = ?'
        const params = [userId]
        gDb.run(stmt, params, function (err, dbRes) {
          if (err) {
            return res.send({ status: 'failed' })
          }
          jMessage = {
            status: 'ok',
            message: 'User exterminated'
          }
          return res.send(jMessage)
        })
      })
    })
    // return res.json({ serversends: userId })
  } 
  catch (error) {
    const err = { message: error.message, where: ' controllers/users.js -> deleteUser function' }
    gLog('err', err.message + ' -> ' + err.where)
  }
}

deleteUserFiles = function (id) {
  const stmt = "SELECT json_extract(imgUrl, '$') AS imgUrl FROM Users WHERE id = ?"
  const params = id
  gDb.all(stmt, params, function (err, jRow) {
    if (err) {
      const error = { success: false, message: err.message, where: 'controllers/users.js -> delete userfiles standalone function' }
      gLog('err', error.message + ' -> ' + error.where)
      return false 
    }
    const imgObj = JSON.parse(jRow[0].imgUrl);
    const imgPath = imgObj.imgPath
    gFs.unlink('./public' + imgPath, (err) => {
      if (err) {
        const error = { success: false, message: err.message, where: 'controllers/users.js -> saveFile -> writefile -> unlink -> unlink' }
        gLog('err', error.message + ' -> ' + error.where)  
      } 
    })
  })
}

module.exports = jUser