var validUser = {}
var algorithm = 'aes-256-ctr'
var password = 'd6F3Efeq'
var iv = '60iP0h6vJoEa'
function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password, iv)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

validUser.valid = function(req, res) {
  var sTopHtml = sTopHtmlRam.replace('{{title}}', 'SignedIn to : : SMS').replace('{{jt-styles}}', '<link rel="stylesheet" href="/css/styles.css">')
  // var sMainHtml = sMainHtmlRam
  var sValidatedBodyHtml = sValidatedBodyHtmlRam
  var sBottomHtml = sBottomHtmlRam.replace('{{js-script}}', '<script src="/js/valid-scripts.js"></script>')
  return res.send(sTopHtml + sValidatedBodyHtml + sBottomHtml); 
}

validUser.getCookie = function(req, res, fCallback)  {
  // console.log(req.body.clientCookie);
  var sCookie = req.body.clientCookie
  var smsCode = decrypt(sCookie)
  var sql = "SELECT * FROM users WHERE code = "+ smsCode
  db.query(sql, function (err, result) {
    if (err) {
      return fCallback(true, false)
    }
    // console.log("Number of records inserted: " + result.affectedRows);
    
    return fCallback(false, true)
  });
}

module.exports = validUser