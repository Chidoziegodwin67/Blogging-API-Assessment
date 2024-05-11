const mongoose = require("mongoose")
const CONFIG = require ("../config/config")
//const logger = require("../logging/logger")




function connectToDb () {
    mongoose.connect(CONFIG.MONGODB_URI)

    mongoose.connection.on("connected", () => {
        console.log("Mongodb connected successfully")
    })

    mongoose.connection.on("error", (err) => {
        console.log(err)

    })
}
module.exports = connectToDb