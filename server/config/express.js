const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const userRoutes = require('../api/routes/users');
const postRoutes = require('../api/routes/posts');

module.exports = () => {
  const app = express();
  app.use(morgan('dev'));
  app.set('port', 3000);
  app.use(express.static('./public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(200).json({});
    }
    next();
  });

  userRoutes(app);
  postRoutes(app);

  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
    res.end('Something broke!');
  });

  return app;
};
