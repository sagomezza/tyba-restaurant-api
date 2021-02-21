//Simple express configuration
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

require("./config/passport")(passport)


const app = express();

//Import mongo client
const mongoInitializer = require('./mongo/client')
//Initialize connection to mongo
mongoInitializer.connectToServer((err) => {
  if (err) console.log(err)
})

//Creating basic HTTP server 
const server = require('http').createServer(app);

//Configuration of the body-parser for request (API calls)
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

//Session configuration
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req,res,next)=> {
  res.locals.success = req.flash('success');
  res.locals.err_msn = req.flash('err_msn');
  res.locals.err  = req.flash('err');
next();
})

//Allow CORS (For web applications if needed)
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,X-HTTP-Method-Override,Content-Type,Accept,Authorization');
  res.header('Access-Control-Allow-Origin: *');
  next();
});

//API calls listing
const userCrud = require('./users/crud')
const search = require('./search')

app.post('/user', (req, res) => {
  userCrud.createUser(req.body).then((result) => {
    res.send({
      result
    })
  }).catch((err) => {
    console.log(err)
    if (err.response === -2) res.status(500).send({
      err
    })
    else res.status(422).send({
      err
    })
  })
})

app.get('/user', (req, res) => {
  userCrud.readUser(req.headers).then((result) => {
    res.send({
      result
    })
  }).catch((err) => {
    console.log(err)
    if (err.response === -2) res.status(500).send({
      err
    })
    else res.status(422).send({
      err
    })
  })
})

app.get('/search', (req, res) => {
  search.findRestaurant(req.headers).then((result) => {
    res.send({
      result
    })
  }).catch((err) => {
    console.log(err)
    if (err.response === -2) res.status(500).send({
      err
    })
    else res.status(422).send({
      err
    })
  })
})

app.get('/historial', (req, res) => {
  search.listHistorial(req.headers).then((result) => {
    res.send({
      result
    })
  }).catch((err) => {
    console.log(err)
    if (err.response === -2) res.status(500).send({
      err
    })
    else res.status(422).send({
      err
    })
  })
})

app.post('/login', passport.authenticate('local', { 
  failureFlash: true,
  successFlash: true  
}))

app.get('/logout', (req, res, next) => {
  req.logout();
  res.send({
    message: "logout"
  })
})

server.listen(3000, () => {
  console.log('Started on port 3000');
});