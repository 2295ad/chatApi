
const {logger} = require('../utils/logger');
const {timeConverter} = require('../utils/timeParser');

class ErrorHandler extends Error {
    constructor( message) {
      super();
      this.message = message;
    }
  }

  const handleError = (err, res) => {
    const { message } = err;
    logger.error(message +"-"+ timeConverter(Date.now()));
    res.send({
      success:false,
      status:500,
      message
    });
  };


  module.exports = {
    ErrorHandler,
    handleError
  };