const mongoStarter = require('../mongo/client')

module.exports.createUser = (parameter) => {
  return new Promise((resolve, reject) => {
    try {
      if (Object.values(parameter).length === 0) { reject({ response: -1, message: `Empty object` }); return }
      if (!parameter.email) { reject({ response: -1, message: `Missing parameter: email` }); return }
      if (!parameter.password) { reject({ response: -1, message: `Missing parameter: password` }); return }
      if (!parameter.password2) { reject({ response: -1, message: `Missing parameter: password2` }); return }
      if (!parameter.name) { reject({ response: -1, message: `Missing parameter: name` }); return }
      if(parameter.password !== parameter.password2) { reject({ response: -3, message: `Passwords don't match` }); return }
      this.readUser({ email: parameter.email })
        .then(res => reject({ response: -1, message: `There is an user with this email` }))
        .catch(err => {
          if (err.response === -3) {
            const db = mongoStarter.getDb()
            db.collection("users").insertOne({
              email: parameter.email,
              password: parameter.password,
              name: parameter.name
            }, (err, result) => {
              if (err) {
                console.log("[createUser, mongoOperation]:", err)
                reject({ response: -2, message: `Something bad happened` })
                return
              } else {
                resolve({ response: 1, message: `User created successfully` })
              }
            })
          } else reject(err)
        })
    } catch (err) {
      console.log("[createUser]:", err)
      reject({ response: -2, message: `Something bad happened` })
    }
  })
}

module.exports.readUser = (parameter) => {
  return new Promise((resolve, reject) => {
    try {
      if (Object.values(parameter).length === 0) { reject({ response: -1, message: `Empty object` }); return }
      if (!parameter.email) { reject({ response: -1, message: `Missing parameter: email` }); return }
      const db = mongoStarter.getDb()
      db.collection("users").find({
        email: parameter.email
      }, {password: 0 }).toArray((err, result) => {
        if (err) {
          console.log("[readUser, mongoOperation]:", err)
          reject({ response: -2, message: `Something bad happened` })
          return
        } else if (result.length === 0) {
          reject({ response: -3, message: `There is no user with email ${parameter.email}` })
          return
        } else {
          if(!parameter.login) delete result[0].password
          resolve({ response: 1, message: `User found`, data: result[0] })
        }
      })
    } catch (err) {
      console.log("[readUser]:", err)
      reject({ response: -2, message: `Something bad happened` })
    }
  })
}