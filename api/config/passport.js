const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userCrud = require('../users/crud')


module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      //match user
      userCrud.readUser({ email: email, login: true })
        .then((res) => {
          if (res.response !== 1) {
            return done(null, false, { message: 'There is no user with that email' });
          }
          //match pass
          if (password === res.data.password) {
            return done(null, res.data);
          } else {
            return done(null, false, { message: 'Incorrect password' });
          }

        })
        .catch((err) => {
          //console.log(err);
          if (err.response === -2) return done(null, false, { message: 'Something bad happened' });
          else return done(null, false, { message: 'There is no user with that email' });
        })
    })

  )
  passport.serializeUser(function (user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function (email, done) {
    userCrud.readUser({ email })
      .then(res => done(res))
      .catch(err => done(err))
  });
}; 