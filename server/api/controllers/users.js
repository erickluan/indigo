const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/post');

exports.getUsers = (req, res) => {
  User.find()
    .select('name email avatar')
    .exec()
    .then(users => {
      res.status(200).json({
        count: users.length,
        users: users,
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.getUserById = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .select('name email')
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404);
      }
      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.signup = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          success: false,
          message: 'Email exists!',
        });
      } else {
        const p = req.body.password;
        if (p.length < 8 || p.length > 56) {
          if (p.length < 8) {
            res.status(400).json({
              success: false,
              message: 'Password too small.',
            });
          } else {
            res.status(400).json({
              success: false,
              message: 'Password too long',
            });
          }
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                // avatar: req.file.path,
              });
              user
                .save()
                .then(newUser => {
                  res.status(201).json({
                    success: true,
                    message: 'User created successfully',
                    user: {
                      id: user._id,
                      name: newUser.name,
                      email: newUser.email,
                      request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/v1/users/' + user._id,
                      },
                    },
                  });
                })
                .catch(err => {
                  res.status(500).json({
                    success: false,
                    errorName: err.name,
                    errorMessage: err.message,
                  });
                });
            }
          });
        }
      }
    });
};

exports.editUser = (req, res) => {
  const token = jwt.decode(req.query.token || req.headers['x-access-token']);
  const promise = User.find({ _id: token.id })
    .then(user => {
      if (user[0].id == token.id) {
        const query = promise
          .update({
            $set: {
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, 10),
            },
          })
          .exec()
          .then(result => {
            res.json({
              message: 'User updated successfully',
              user: {
                newName: result.name,
                newEmail: result.email,
                request: {
                  type: 'POST',
                  url: 'http://localhost:3000/api/v1/users/' + user._id,
                },
              },
            });
          });
      } else {
        res.status(401).json({
          message: `You can't edit this user!`,
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.deleteUser = (req, res) => {
  const token = jwt.decode(req.query.token || req.headers['x-access-token']);
  const id = token.id;
  User.findByIdAndRemove(id, { rawResult: true }, (err, result) => {
    if (err) {
      res.status(500).json(err);
    }
    res.status(200).json({
      message: 'The user was deleted',
      result: result,
      request: {
        type: 'POST',
        url: 'http://localhost:3000/api/v1/users/' + result._id,
      },
    });
  }).catch(err => {
    res.status(500).json({ error: err });
  });
};

exports.getPostsFromUser = (req, res) => {
  User.find({ _id: req.params.id })
    .exec()
    .then(user => {
      if (!user || user.length === 0) {
        return res.status(404).json({ message: `The user don't exists.` });
      } else {
        Post.find({ uid: req.params.id }, { _id: false, __v: false })
          .populate('users')
          .exec()
          .then(posts => {
            if (!posts || posts.length === 0) {
              return res.status(404).json({
                message: `This user don't have posts!`,
              });
            }
            res.status(200).json({
              count: posts.length,
              posts: posts,
            });
          })
          .catch(err => {
            res.status(500).json({ error: err });
          });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
