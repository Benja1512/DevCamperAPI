const express = require('express');
const dotenv = require('dotenv');
const apps = express();
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error')



// Routes files
const bootcamps = require('./routes/bootcamps.js');


const app = express();

//body parser
app.use(express.json())

// Connect env vars
connectDB();

// load env vars
dotenv.config({ path: './config/config.env'});

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
    use(morgan('dev'));
}


// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);



const PORT = process.env.PORT || 5000;

app.listen(
    PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

//Handle unhandled promise rejections

function server(param) {
    
}

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //close server & exit process
    
    server(() => process.exit(1));
});
