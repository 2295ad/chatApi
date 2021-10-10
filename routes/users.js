const express = require('express');
const dotenv = require("dotenv");
const route = express.Router();

const dbConfig = require('../config/db.config');
const { USER_EVENT } = require('../constants/socketEvents');
const db = require('monk')(dbConfig.url);
const {checkCache} = require('../helper/checkCache');


//get config parameters
dotenv.config();


route.get('/fetchPosts',checkCache,async(req,res,next)=>{
    try{
      let count = parseInt(req.query.count);
      let collection = await db.get('user');
      let documentCount = await collection.count();
      if(count === 10 && documentCount >count){
        count=documentCount;
      };
      let results = await collection.find({"postcount":{$gt:count-10,$lte:count}});

      //adding data to cache
      if(results.length ){
          req.client.setex(results[results.length-1].postcount,process.env.TTL,JSON.stringify(results),(err,data)=>{
            if(err) {
              next(err);
            }else if(!err && data){
              res.send({data:results,...res.locals});
            }
          })
      }else{
          res.send(res.locals);
      }
    }catch(e){
        next(e);
    }
});

route.post('/savePost',async(req,res,next)=>{
    try{
      const body = req.body;
      body.ts = Math.floor(Date.now() / 1000);
      let collection = await db.get('user');
      let count = await collection.count();
      body.postcount = count+1;
      await collection.insert(body).catch((e)=>console.log(e));
      res.locals.msg = 'Post successfully submited';
      req.io.emit(USER_EVENT.PUSH_POST,body);
      res.send({ ...res.locals})
    }catch(e){
        next(e);
    }
});




module.exports = route;