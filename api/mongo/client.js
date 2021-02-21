const MongoClient = require('mongodb').MongoClient;
const dbName = process.env.MONGO_DB_NAME
const port = process.env.MONGO_PORT
const url = `mongodb://${process.env.MONGO_DB}:${port}/${dbName}`
console.log(url)
let _db;

const connectToServer = async (callback) => {
    console.log('Connecting to mongo')
    const client = new MongoClient(url, { useUnifiedTopology: true });
    console.log('client created')
    client.connect(err => {
        console.log('connecting to client')
        _db = client.db(dbName)
        console.log('client connected')
        return callback(err)
    })
}
//
const getDb = () =>  _db 

module.exports = {connectToServer, getDb}