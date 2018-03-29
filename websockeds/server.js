var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(3000)
app.use(express.static(__dirname + '/public'))
var fs = require('fs')

var setup = () => {
  console.log('SETTING VARIABLES')
  iHttpPort = process.argv[process.argv.indexOf('--HTTP') + 1]
  iHttpsPort = process.argv[process.argv.indexOf('--HTTPS') + 1]
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/trigger', function (req, res) {
  fs.readFile(__dirname + '/data.txt', 'utf8', function (err, sData) {
    console.log(sData)
    io.emit('this is the data', { "status": sData })
    res.send('DONE')
  })
})


io.on('connection', function (socket) {
  console.log('a user connected');
  // console.log(socket)
  io.emit('isConnected', { "status": "ok" })
  socket.on('grabbMessage', function (jData) {
    console.log(jData)
    socket.emit('chat', jData)
    socket.broadcast.emit('chat', jData)
  })

});


// http.listen(3000);
http.listen(1981, function () {
  console.log('listeningon port 1981');
  
})


