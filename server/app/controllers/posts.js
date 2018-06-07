let jwt = require('jsonwebtoken');

let Post = require('../models/post');
let User = require('../models/user');

module.exports.getPosts = function (req, res) {
    let token = jwt.decode(req.query.token || req.headers['x-access-token']);
    let promise = Post.find({'uid': token.id}, {__v:false}).populate('uid', 'name -_id').exec();
    promise.then(
        function (posts) {
            res.json(posts);
        }
    ).catch(
        function (error) {
            res.status(500).end();
        }
    )
}

module.exports.getPostById = function (req, res) {
    let id = req.params.id;
    let promise = Post.findById(id, {__v: false}).populate('uid', 'name -_id').exec();
    promise.then(
        function (post) {
            res.json(post);
        }
    ).catch(
        function (error) {
            res.status(404).send(`Don't Found`);
        }
    )
}

module.exports.newPost = function (req, res) {
    let token = jwt.decode(req.query.token || req.headers['x-access-token']);
    let post = new Post({
        text: req.body.text,
        uid: token.id
    });
    let promise = Post.create(post);
    promise.then(
        function (post) {
            console.log(post);
            res.status(201).json(post);
        }
    ).catch(
        function (error) {
            res.status(500).end();
        }
    )
}

module.exports.editPost = function (req, res) {
    let token = jwt.decode(req.query.token || req.headers['x-access-token']);
    let id = req.params.id;
    let promise = Post.find({_id: id});
    promise.then(
        function (post) {
            if (post[0].uid == token.id) {
                let update = Post.findByIdAndUpdate(id,{ text: req.body.text }, { new: true }, 
                    function (err, updated) {
                        if (err) {
                            res.status(500).send(`Edit hasn't happen`)
                        }
                        res.json(updated);
                })

                // let query = promise.update({ $set: { text: req.body.text } }).exec().then(
                //     function (result) {
                //         res.json(result);
                //     }
                // );
            } else {
                res.status(401).json({
                    message: `You can't edit this post!`
                })
            }
        }
    ).catch(
        function (error) {
            console.log(error);
            res.status(500).end();
        }
    )
}

module.exports.deletePost = function (req, res) {
    let token = jwt.decode(req.query.token || req.headers['x-access-token']);
    let id = req.params.id;
    let promise = Post.find({ _id : id });
    promise.then(
        function (post) {
            if (post[0].uid == token.id) {
                let deletepost = Post.deleteOne({_id: id}).then(
                    function (result) {
                        res.json(result);
                    }
                );
            } else {
                res.status(401).json({
                    message: `You can't delete this post!`
                })
            }
        }
    ).catch(
        function (error) {
            res.status(404).send(`The user don't exists`);
        }
    )
}

module.exports.getUserFromPost = function (req, res) {
    let token = jwt.decode(req.query.token || req.headers['x-access-token']);
    let id = req.params.id;
    let promise = Post.find({ _id : id },{_id: false, text: false, likes: false, __v: false}).populate('uid', 'id name email').exec();
    promise.then(
        function (post) {
            res.json(post);
        }
    ).catch(
        function (error) {
            res.status(404).send(`The user don't exists`);
        }
    )
    console.log(req.body);
}