const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signin = async (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const token = jwt.sign(
            { id: user._id },
            'utAIgD2JoBrO4tEGEc5iMpYXMzLNDW8z'
          );
          res.status(200).json({
            success: true,
            message: `The user is Logged`,
            user: {
              id: user._id,
              token: token,
            },
          });
        } else {
          res.status(401).json({
            success: false,
            message: `Invalid Credentials. Put a correct password or email.`,
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: `User Not Found`,
        });
      }
    })
    .catch(err => {
      return res.status(500).json({ error: err, message: err.message });
    });
};

exports.verifyAccessToken = (req, res, next) => {
  jwt.verify(
    req.headers['x-access-token'],
    'utAIgD2JoBrO4tEGEc5iMpYXMzLNDW8z',
    (err, decoded) => {
      if (err) {
        res.status(401).json({
          message: 'Not Authorized',
        });
      } else {
        next();
      }
    }
  );
};
