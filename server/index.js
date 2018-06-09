let http = require('http');

const config_express = require('./config/express');
const db = require('./config/database');

const app = config_express();
http.createServer(app).listen(app.get('port'), function() {
  console.log(`Server ON! In port: http://localhost:3000/`);
});
db('mongodb://localhost:27017/indigo');
