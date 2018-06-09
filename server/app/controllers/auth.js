const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports.signin = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
          { id: user._id },
          'utAIgD2JoBrO4tEGEc5iMpYXMzLNDW8z'
        );
        res.status(200).json({
          id: user._id,
          token: token,
          message: 'The user is Logged',
        });
      } else {
        res.status(401).json({
          title: `auth/invalid-credentials`,
          message:
            'Your credentials are invalid. Put a correct password or email.',
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

module.exports.verifyAccessToken = (req, res, next) => {
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
