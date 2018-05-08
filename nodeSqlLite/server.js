const sqlite3 = require('sqlite3') // .verbose() = more feeback for debugging

const db = new sqlite3.Database(__dirname + '/db.db')


// let startDate = Date.now()
// let inserts = ''

// for (let i = 0; i < 10; i++) {
//   inserts += "('A')," 
// }
// inserts = inserts.slice(0, -1)
// console.log(inserts);

// let stmt = 'INSERT INTO users (name) VALUES ' + inserts
// db.run(stmt, function (err) {
//   let rightNow = Date.now();
//   let deltaTime = (rightNow - startDate) 
//   console.log(deltaTime + 'ms');
//   db.all("SELECT COUNT(*) AS total FROM users", function (err, ajRows) {
//     console.log(ajRows[0].total)
//   })
  
// })

let aParams = ['hæ', 32]
let stmt = "UPDATE messages SET data = json_set(data, '$[0].data, 'hæ') WHERE userId = 31"
db.run(stmt, function (err) {
  console.log('elements update: ' + this.changes);
})


// var aData = [null, 'D']
// var sQuery = "INSERT INTO users VALUES(?,?)"
// var aNewData = []
// for (let i = 0; i < 1000; i++) {
//   aNewData.push([null, 'D'])
// }
// console.log(aNewData);

// db.run(sQuery, aNewData, function (err) {
//   // console.log('xxx');
//   // return true
//     // console.log('**********)
//     console.log('insert this is : ', this)
//     // this contains: { sql: 'INSERT INTO users VALUES(?,?)', lastID: 4, changes: 1 }
// })
  
// db.all("SELECT COUNT(*) AS total FROM users", function (err, ajRows) {
//   // console.log(ajRows);
//   // ajRows.forEach(jRow => {
//   //   console.log(jRow.name, jRow.id);

//   // })
//   console.log(ajRows[0].total)
// })

// let sName = 'D'
// let stmt = "DELETE FROM users WHERE name = ?"
// db.run(stmt, sName, function (err) {
//   console.log('elements deleted: ' + this.changes);
  
// })

// let aParams = ['x', 'A']
// let stmt = "UPDATE users SET name = ? WHERE name = ?"
// db.run(stmt, aParams, function (err) {
//   console.log('elements update: ' + this.changes);
// })


 

