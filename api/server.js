var express = require('express');
var app = express();


var mongoInitializer = require('./mongo/client')
mongoInitializer.connectToServer((err) => {
  if(err) console.log(err)
})

var server = require('http').createServer(app);


const bodyParser = require('body-parser');


app.use(bodyParser.json({
  limit: "50mb"
}));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 50000
}));
app.use(bodyParser.urlencoded({
  extended: true
}));


//Allow CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,X-HTTP-Method-Override,Content-Type,Accept,Authorization');
  res.header('Access-Control-Allow-Origin: *');
  next();
});


server.listen(3000, () => {
  console.log('Started on port 3000');
});