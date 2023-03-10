
const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
//const fileupload = require('express-fileupload'); 


const app = express()

const userRoute = require("./routes/userRoute");
const projectRoute = require("./routes/projectRoute");
const serviceRoute = require('./routes/serviceRoute');
const experienceRoute = require('./routes/experienceRoute');
const testimonialsRoute = require('./routes/testimonialsRoute')
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser')

//const path = require("path");

//middleware
app.use(express.json()) //handle json data in the app
app.use(express.urlencoded({extend:false})) //handle data come from url
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.use(express.static(__dirname));

//app.use(fileupload({useTempFiles: true}))
//Routes Middleware
app.use("/api/users", userRoute)
app.use('/api/project', projectRoute)
app.use('/api/service', serviceRoute) 
app.use('/api/experience', experienceRoute)
app.use('/api/testimony', testimonialsRoute)

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