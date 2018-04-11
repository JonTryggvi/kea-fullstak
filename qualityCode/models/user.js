var jUser = {}

jUser.getOneRandomUser = (fCallback) => {
  //  TODO: Connect to the datavase
  //  TODO: Query the data to get a user
  /*
    
    stmt = 'SELECT * FROM users LIMIT 1'
    db.query(stmt, (err, aUsers) => {
      if(err) {
        return callBack(true, [])
      }
      
    })
  
  */
  var aUsers = [{ "id": 1, "name": "A" }]
  return fCallback(false, aUsers[0])
}

module.exports = jUser