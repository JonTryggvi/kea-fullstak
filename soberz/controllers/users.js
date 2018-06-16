const bcrypt = require('bcrypt-nodejs')

const user = {}

user.login = function (req, res) {
  const password = req.body.password 
  const email = req.body.email
  const stmt = "SELECT Users.id, Users.activated, Users.online, user_roles.role_name FROM Users INNER JOIN user_roles ON Users.user_role = user_roles.role_id  WHERE (email = $auth OR mobile = $auth) AND password = $pass"
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
    gDb.run('UPDATE Users SET online = ? WHERE Users.id = ?', [1, jRow.id], function (err) {
      if (err) {
        jError = { message: 'update User set online error: ' + err, where: 'update online status -> loginUser function: 2' }
        gLog('err', jError.message + ' -> ' + jError.where)
        return false
      }
    })
    
    const jRes = { message: 'ok', response: jRow }
    return res.json(jRes)
  })
  // gDb.close() 
}

user.getThisUser = function (req, res) {
  const userId = req.body.userId
  const stmt = "SELECT about, json_extract(a.imgUrl, '$') AS userImg, json_extract(a.sponsors, '$') AS sponsors, json_extract(a.sponsees, '$') AS sponsees, a.id, a.email, a.firstname, a.lastname, a.mobile, a.sponsor, a.username, a.online, a.activated, b.gender_name AS gender, c.role_name AS role FROM Users AS a INNER JOIN genders  AS b ON (a.gender = b.id) INNER JOIN user_roles AS c ON (a.user_role = c.role_id) WHERE a.activated = 1 AND a.id = ?"
  gDb.all(stmt, [userId], function (err, jRow) {
    if (err) {
      const jError = { message: 'Get logged in User error: ' + err, where: 'controllers/user.js -> getThisUser function' }
      gLog('err', jError.message + ' -> ' + jError.where)
      const sjError = JSON.stringify(jError)
      return res.json(sjError)
    }
    const jRes = { message: 'ok', response: jRow[0] }
    return res.json(jRes)
  })

}

module.exports = user