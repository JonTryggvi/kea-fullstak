var jMongo = {}
var ObjectId = require('mongodb').ObjectID
jMongo.getAll = () => {

}

jMongo.createUser = function(req, res) {
  var postData = req.fields
  // console.log(postData);
  var jUser = postData
 
  db.collection('users').insertOne(req.fields, (err, jResult) => {
    // if (err) {
    //   var jError = { "status": "error", "message": "ERROR -> student JSON -> 001" }
    //   // return res.send('error')
    // }
    var jOk = { "status": "ok", "message": "student JSON -> saved -> 000" }
    return res.send(jOk) 
    
  })

}

module.exports = jMongo
