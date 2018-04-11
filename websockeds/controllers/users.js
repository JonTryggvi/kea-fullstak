var fs = require('fs')
var users = {}
/************************ show all the users *****************************/
users.getUsers = (fCallback) => {
  // get the data from the collection 'users'
 
}

/************************ svae all the users *****************************/

users.saveUser = (sPath, jUserData, fcallback) => {
  // console.log(sPath);
  // var sData = fs.readFileSync(sPath, 'utf8');
  // console.log( sData.length);
 
  // console.log(sData);
  aData = JSON.parse(sData)
  
  aData.users.push(jUserData)
  // console.log(aData);
  sData = JSON.stringify(aData)
  // var aData = JSON.parse(sData);
  // console.log(aData);
  
  fs.writeFile(sPath, sData, function(err, data) {
    if (err) {
      gLog('err', 'err 01 users -> not able to save user '+ err);
      // fcallback(true, 'err 01 users -> not able to save user ' + err)
    }
    // console.log(data);
  
    
  })
  
  fcallback(false, jUserData)

}

users.checkUser = (sPath, sUserToCheck, fcallback) => {
  var sData = fs.readFileSync(sPath, 'utf8');

  var aData = JSON.parse(sData);
  var users = aData.users
  var userExists = false;
  var existingUser = []
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === sUserToCheck.name && users[i].psw === sUserToCheck.psw) {
      userExists = true; 
      aData.users[i].active = true;
      existingUser.push(aData.users[i])
    }
    
  } 
  console.log(userExists);
  
  sData = JSON.stringify(aData)
  // console.log(sData);
  fs.writeFile(sPath, sData, function (err, data) {
    if (err) {
      gLog('err', 'err 01 checkUser -> not able to write user to file ' + err);
      return
    }
    // console.log(data);
  })
  sExistingUser = JSON.stringify(existingUser)
  fcallback(false, [userExists, sExistingUser])
  // var found = users.find(user => user.name === sUserToCheck.name && user.psw === sUserToCheck.psw)
}

users.logOut = (sPath, userId, fcallback) => {
  var aData = JSON.parse(sData);
  var users = aData.users
 
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === userId) {
      aData.users[i].active = false;
    }
  }
  sDataNew = JSON.stringify(aData)

  fs.writeFile(sPath, sDataNew, function (err, data) {
    if (err) {
      gLog('err', 'err 03 users -> not able to logout user ' + err);
      return
    }
    // console.log(data);
  })
  fcallback(false, 'logged out')
  // var found = users.find(user => user.name === sUserToCheck.name && user.psw === sUserToCheck.psw)
}

users.getUserById = (userId) => {
  // console.log(sData);
  jaData = JSON.parse(sData);
  aUsers = jaData.users
 
 
  var jResponse = {}
  for (let i = 0; i < aUsers.length; i++) {
    if (userId == aUsers[i].id) {
      aUsers[i].name;
      jResponse.success = true;
      jResponse.name = aUsers[i].name
      jResponse.userMsgs = aUsers[i].messages
      jResponse.id = aUsers[i].id
      return jResponse
    }
  
  }
  jResponse.success = false;
  jResponse.errMessage = 'err 05 users -> not able to find any users '
  return jResponse
  
}

users.getActiveUsers = () => {
  var ajData = JSON.parse(sData);
  // console.log(ajData);
  
  aUsers = ajData.users
  var isActive;
  var aActiveUsers = []
  // console.log(aUsers);
  for (let i = 0; i < aUsers.length; i++) {
    isActive = aUsers[i].active
    if (isActive) {
      aActiveUsers.push(aUsers[i])
    }   
  }
  // console.log(aActiveUsers);
  return aActiveUsers
}
module.exports = users