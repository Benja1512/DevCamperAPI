const express = require('express');
const dotenv = require('dotenv');
const app = express();
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db')



// Routes files
const bootcamps = require('./routes/bootcamps.js');

// Connet env vars
connectDB();

// load env vars
dotenv.config({ path: './config/config.env'});

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// Mount routers
app.use('/api/v1/bootcamps', bootcamps);



const PORT = process.env.PORT || 5000;

app.listen(
    PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

//Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //close server & exit process
    server.close(() => process.exit(1));
});
