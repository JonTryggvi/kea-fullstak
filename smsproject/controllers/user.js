function random4Digit() {
  return shuffle("0123456789".split('')).join('').substring(0, 4);
}
function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

var algorithm = 'aes-256-ctr'
var  password = 'd6F3Efeq'
var iv = '60iP0h6vJoEa'
function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password, iv)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password, iv)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

// var hw = encrypt("hello world")
// // outputs hello world
// console.log(decrypt(hw));

var jUser = {}
jUser.saveUser = (req, res) => {
  // console.log(req)
  var sUserName = req.body.username
  var sUserEmail = req.body.email
  var sMobile = req.body.phone
  var iMobile = Number(sMobile)
  var apiToken = '$2y$10$XIjR65PxSUmubingTSknqOIN62DEoNwydecPd69U7xGKjho7BHhN6'
  var iCode = random4Digit();

  var sql = "INSERT INTO users (username, email, code, phone) VALUES ?"
  var values = [
    [sUserName, sUserEmail, iCode, iMobile]
  ];

  db.query(sql, [values], function (err, result) {
    if (err) throw err
    // console.log("Number of records inserted: " + result.affectedRows);
    res.send([apiToken, iMobile, iCode])
  });
  // db.end()
}
 
jUser.validateUser = (req, res) => {
  var clientCode = req.body.verifiedCode
  var sql = "UPDATE users SET  userVerified = 1 WHERE code = " + clientCode 
  var value = clientCode
  // db.connect();
  db.query(sql, function (err, result) {
    if (err) {
      return res.send('unsuccessful '+ err)
    } 

  
    
    result.code = encrypt(clientCode, '123')// crypto.createHash('md5').update(clientCode).digest("hex")
    
    
    return res.send(result) 
  })
  // db.end()
  // return res.send(clientCode)
}

jUser.test = (req, res) => {
  var testString = '123'
  var enCripted = encrypt(testString, '123')
  console.log(enCripted);
  
  var deCrypted = decrypt(enCripted, '123')
  console.log(deCrypted);
  
  return res.send('<h1>aces</h1>')
}


module.exports = jUser