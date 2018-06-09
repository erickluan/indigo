const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');

const userRoutes = require('../app/routes/users');
const postRoutes = require('../app/routes/posts');

module.exports = () => {
  const app = express();
  app.set('port', 3000);
  app.use(express.static('./public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('dev'));
  userRoutes(app);
  postRoutes(app);

  return app;
};
