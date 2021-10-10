const express = require('express');
const http = require('http');
const bodyParser  = require("body-parser");
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');


const { handleError } = require('./helper/error');
const connectSocket = require('./helper/socket');
const restService = require("./routes/index");
const {logger} = require('./utils/logger');

// Restrict all routes to only 100 requests per IP address every 1o minutes
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,    // 1 minutes
  max: 100                     // 100 requests per IP
});


const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io =connectSocket(server);

app.use(cors());
app.use(limiter);
app.use(compression());
app.use(helmet());
// Protect against XSS attacks, sanitizes request data
app.use(xssClean());
// Remove all keys containing prohibited characters
app.use(mongoSanitize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//pass on socket channel to different routes
app.use(function(req,res,next) {
  req.io = io;
  next();
});
app.use('/', restService);


app.use((err, req, res, next) => {
    handleError(err, res);
});

server.listen(port,()=>{
    logger.info(`API IS RUNNING IN ${port}`)
})


