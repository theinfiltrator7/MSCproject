const { compareSync } = require("bcryptjs");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let message = "";
  if(err.code === 11000){
    let value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    // value = value.replace(/"/g,"");
    message = `${value} already exists. Try another value.`
  }
  
  

  res.status(err.statusCode).json({
    status: err.status,
    message: message? message: err.message
  })
}