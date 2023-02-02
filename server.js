
const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()

const userRoute = require("./routes/userRoute");
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser')
//middleware
app.use(express.json()) //handle json data in the app
app.use(express.urlencoded({extend:false})) //handle data come from url
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

//Routes Middleware
app.use("/api/users", userRoute)

//routes
app.get('/', (req, res) => {
    res.send('home page')
})

//errorHandler Middleware
app.use(errorHandler)
const PORT = process.env.PORT||5000;
mongoose.set('strictQuery', true)
//connect to mongoose server and start server

mongoose  
    .connect(process.env.MONGO_URI)
    .then(() => { 
        app.listen(  
            PORT,
            () => console.log(`mongo server is running on port ${PORT} good job!`)  
        )})
        .catch((err) => console.log(err))