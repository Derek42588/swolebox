if (process.env.NODE_ENV === 'production') {
    //in production mode, return prod keys
    module.exports = require('./prod');
  } else {
    //in development mode, return dev keys
    module.exports = require('./dev');
  }
  