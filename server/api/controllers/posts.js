const jwt = require('jsonwebtoken');

const Post = require('../models/post');
const User = require('../models/user');

exports.newPost = (req, res) => {
  const token = jwt.decode(req.query.token || req.headers['x-access-token']);
  const post = new Post({
    text: req.body.text,
    uid: token.id,
  });
  Post.create(post)
    .then(newPost => {
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        post: {
          _id: newPost._id,
          text: newPost.text,
          uid: newPost.uid,
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/api/v1/posts/' + newPost._id,
        },
      });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err })
        .end();
    });
};

exports.getPosts = (req, res) => {
  const token = jwt.decode(req.query.token || req.headers['x-access-token']);
  Post.find({ uid: token.id })
    .select('-__v')
    .populate('uid', 'name -_id')
    .exec()
    .then(posts => {
      if (posts.length == 0) {
        res.json({ message: `You don't have any posts yet` });
      } else {
        res.json(posts);
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.getPostById = (req, res) => {
  const idPost = req.params.id;
  Post.findById(idPost)
    .select('-__v')
    .populate('uid', 'name -_id')
    .exec()
    .then(post => {
      if (!post) {
        return res.status(404).json({
          success: false,
          message: `This post don't exists.`,
        });
      }
      res.json({
        success: true,
        post: post,
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.editPost = (req, res) => {
  const token = jwt.decode(req.query.token || req.headers['x-access-token']);
  const idPost = req.params.id;
  Post.find({ _id: idPost })
    .exec()
    .then(post => {
      if (post[0].uid == token.id) {
        Post.findByIdAndUpdate(
          idPost,
          { text: req.body.text },
          { new: true },
          (err, updated) => {
            if (err) {
              return res.status(500).json({ message: `Edition hasn't happen` });
            } else {
              res.status(201).json({
                message: 'Post updated successfully',
                post: {
                  newText: updated.text,
                },
              });
            }
          }
        );
      } else {
        return res.status(401).json({
          success: false,
          message: `You can't edit this post!`,
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.deletePost = (req, res) => {
  const token = jwt.decode(req.query.token || req.headers['x-access-token']);
  const idPost = req.params.id;
  Post.find({ _id: idPost })
    .exec()
    .then(post => {
      if (!post) {
        res.status(404).json({
          success: false,
          message: `This post can't be deleted because it's don't exists`,
        });
      } else {
        if (post[0].uid == token.id) {
          const deletepost = Post.deleteOne({ _id: idPost }).then(result => {
            res.status(200).json({
              success: true,
              message: 'Post deleted successfully!',
            });
          });
        } else {
          res.status(401).json({
            success: false,
            message: `You can't delete this post!`,
          });
        }
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.getUserFromPost = (req, res) => {
  const idPost = req.params.id;
  Post.find({ _id: idPost })
    .select('uid -_id')
    .populate('uid', 'id name email')
    .exec()
    .then(userFromPost => {
      if (!userFromPost || userFromPost.length === 0) {
        res.status(400).json({
          message: `The post don't exists. Because of that we can't find a user.`,
        });
      } else {
        res.json({
          success: true,
          user: userFromPost,
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
