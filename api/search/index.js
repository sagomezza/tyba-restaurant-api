const mongoStarter = require('../mongo/client')
const axios = require("axios")

module.exports.findRestaurant = (parameter) => {
  return new Promise((resolve, reject) => {
    if (Object.values(parameter).length === 0) { reject({ response: -1, message: `Empty object` }); return }
    if (!parameter.email) { reject({ response: -1, message: `Missing parameter: email` }); return }
    if (!parameter.location) { reject({ response: -1, message: `Missing parameter: location` }); return }
    if (typeof parameter.location === "string") {
      const params = {
        access_key: process.env.GEOCODE_KEY,
        query: parameter.location
      }
      axios.get(`http://api.positionstack.com/v1/forward`, { params })
        .then(geocodeRes => {
          parameter.location = { latitude: geocodeRes.data.data[0].latitude, longitude: geocodeRes.data.data[0].longitude }
          searchRestaurants(parameter)
            .then(res => {
              console.log("5")
              resolve(res)
              return;
            })
            .catch(err => reject(err))
        })
    } else {
      searchRestaurants(parameter)
        .then(res => resolve(res))
        .catch(err => reject(err))
    }
  })
}

searchRestaurants = (parameter) => {
  return new Promise((resolve, reject) => {
    console.log("1")
    const params = {
      location: `${parameter.location.latitude},${parameter.location.longitude}`,
      radius: 1500,
      type: 'restaurant',
      keyword: 'cruise',
      key: process.env.GOOGLE_KEY
    }
    console.log("2")
    axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', { params })
      .then(searchRes => {
        historial(parameter)
          .then(res => {
            resolve({ response: 1, message: `Search results`, data: searchRes.data.results })
          })
          .catch(err => reject(err))
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

historial = (parameter) => {
  return new Promise((resolve, reject) => {
    const db = mongoStarter.getDb()
    db.collection("historial").insertOne({
      email: parameter.email,
      location: parameter.location,
      date: new Date()
    }, (err, result) => {
      if (err) {
        console.log("[historial, mongoOperation]:", err)
        reject({ response: -2, message: `Something bad happened` })
        return
      } else {
        resolve({ response: 1, message: `Historial created successfully` })
      }
    })
  })
}
module.exports.listHistorial = (parameter) => {
  return new Promise((resolve, reject) => {
    try {
      if (Object.values(parameter).length === 0) { reject({ response: -1, message: `Empty object` }); return }
      if (!parameter.email) { reject({ response: -1, message: `Missing parameter: email` }); return }
      const db = mongoStarter.getDb()
      db.collection("historial").find({
        email: parameter.email
      }, { password: 0 }).toArray((err, result) => {
        if (err) {
          console.log("[listHistorial, mongoOperation]:", err)
          reject({ response: -2, message: `Something bad happened` })
          return
        } else if (result.length === 0) {
          reject({ response: -3, message: `There is no historial for user with email ${parameter.email}` })
          return
        } else {
          resolve({ response: 1, message: `Historial found`, data: result })
        }
      })
    } catch (err) {
      console.log("[listHistorial]:", err)
      reject({ response: -2, message: `Something bad happened` })
    }
  })
}