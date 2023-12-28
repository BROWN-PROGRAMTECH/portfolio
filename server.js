
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors');
//const fileupload = require('express-fileupload'); 

const app = express() 

const userRoute = require("./routes/userRoute");
const projectRoute = require("./routes/projectRoute");
const serviceRoute = require('./routes/serviceRoute');
const experienceRoute = require('./routes/experienceRoute');
const testimonialsRoute = require('./routes/testimonialsRoute')
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser')

const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
//middleware
app.use(express.json()) //handle json data in the app
app.use(express.urlencoded({extended:true})) //handle data come from url
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }))
// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://localhost:3000"  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});


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
// console.log(typeof(process.env.MONGO_URI), process.env.MONGO_URI)
mongoose  
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {  
        app.listen(  
            PORT,
            () => console.log(`mongo server is running on port ${PORT} good job!`)  
        )})
        .catch((err) => console.log(err))  
