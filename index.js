'use strict';

//MAIN STARTING POINT of the application
const express = require('express');
const http = require('http');//native Node library, working with http requests
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express(); //create instance of express
const router = require('./router');
const mongoose = require('mongoose');

//DB Setup: Hey mongoose, please go connect to the instance of MongoDB
mongoose.connect('mongodb://localhost/thinkful-backend');

// APP SET UP: getting Express working the way we want
//MORGAN AND BODYPARSER are middlewares in Express
//Any incoming requests into server will pass to morgan and bodyparser first
app.use(morgan('combinsed'));//Morgan is logging framework
//bodyparser is going to parse incoming requests
app.use(bodyParser.json({type: '*/*'}));
router(app);

//SERVER SETUP: getting the Express setup to talking to the outside world
//This is the port the server is going to run on on our server machine
const port = process.env.PORT || 3090;
//create http server that Node recieve requests, anything the comes in
//go ahead and forward it onto App (express aplication)
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);