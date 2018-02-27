// this comes from a API
// var jUser = { "id": 1, "name": "A", "siblings":[{id:2, name:"B"},{id:2, name: "C"}] }
var jUser = { "id": 1, "name": "A" }
try {

  // this will go to a server or savv to database

  var jSendToServer = { id: 123, message: "test", name: jUser.name, siblingOneName: jUser.siblings[0].name }

  console.log(jSendToServer);
  // console.log(jUser.name);

} catch (ex) {
  console.log('EX - 000 - server1.js - function test: ' + ex);
}
console.log('x');