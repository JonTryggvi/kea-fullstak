var express = require("express");
var app = express();

app.get('/', (req, res) => {
  res.send('SilentRecorders!')
})

app.listen(3333, err => {
  console.log('OK');
  
})