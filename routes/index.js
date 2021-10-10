const express = require('express');
const app = express();
const dotenv = require("dotenv");
const redis = require("redis");

//get config parameters
dotenv.config();

const {logger} = require('../utils/logger');
const users = require('./users');

const redisPort = process.env.REDIS_PORT;

//configure redisClient
const redisClient = redis.createClient(redisPort);
redisClient.on('connect', () => {
  logger.info(`REDIS CONNECTED ON PORT ${redisPort}` );
});
redisClient.on('error', (err) => {
  logger.error("REDIS ERROR : " + err);
});

//add common success response
app.use(function(req,res,next) {
  req.client = redisClient;
  res.locals = {
    success:true,
    status:200
  };
  return next();
});
app.use('/users',users);


app.use('*', (req, res) => {
    res.send('Internal server error');
  })

//shut redisclient when app is closed
process.on('SIGTERM',()=>{
  if(redisClient){
    redisClient.flushall((err,data)=>{
      if(!err){
        logger.info("Redis data flushed, when service is closed");
      }
    });
    // redisClient.quit();
  }
})

module.exports = app;