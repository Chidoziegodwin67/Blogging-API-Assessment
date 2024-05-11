const express = require("express")
const bodyParser =require("body-parser")
const CONFIG = require("./config/config")
const authRoutes = require("./routes/authRoutes")
const helmet = require('helmet')



const connectToDb = require ("./db/mongodb")



const app = express()


// connect to mongodb
connectToDb();


//Add middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/auth', authRoutes);

// auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth0Middleware);




///security middlelware
app.use(helmet())



app.get("/",  (req,res) => {
   res.send("welcome to my blogging api")
})

//err handler middleware
app.use((err, req, res, next) => {
   log.error(err.massage)
   const errorStatus = err.status || 500
   res.status(errorStatus) .send(err.massage)

   next()
})

app.listen(CONFIG.PORT,() => {
   console.log(`Server started on http://localhost:${CONFIG.PORT}`)
})