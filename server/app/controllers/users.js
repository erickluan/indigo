let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

let User = require('../models/user');
let Post = require('../models/post');

module.exports.getUsers = function (req, res) {
    let promise = User.find({},{_id: false, password:false, __v:false}).exec();
    promise.then(
        function (users) {
            console.log(users);
            res.json(users);
        }
    ).catch(
        function () {
            res.status(404).send(`Don't exists!`);
        }
    )
}

module.exports.getUserById = function (req, res) {
    console.log(req);
    let id = req.params.id;
    let promise = User.findById(id,{_id: false, password:false, __v:false});
    promise.then(
        function (user) {
            res.json(user);
        }
    ).catch(
        function (error) {
            res.status(404).send(`User Not Found`);
        }
    )
}

module.exports.newUser =  function (req, res) {
    console.log(req.body);
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    });
    let promise = User.create(user);
    promise.then(
        function (user) {
            res.status(201).json({
                id: user._id,
                name: user.name,
                email: user.email
            });
        }
    ).catch(
        function (error) {
            res.status(404).send(`Don't exists`);
        }
    )
}

module.exports.editUser = function (req, res) {
    /* TODO: 
        - Ver uma forma mais segura de editar o usuário
    */
    let token = jwt.decode(req.query.token || req.headers['x-access-token']);
    let promise = User.find({_id: token.id});
    User.findByIdAndUpdate(token.id, )
    promise.then(
        function (user) {
            if (user[0].id == token.id) {
                let query = promise.update(
                    { $set: {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    }}).exec().then(
                    function (result) {
                        res.json(result);
                    }
                );
            } else {
                res.status(401).json({
                    message: `You can't edit this user!`
                })
            }
        }
    ).catch(
        function (error) {
            res.status(404).send(`The user don't exists`);
        }
    )
    console.log(req.body);
}

module.exports.deleteUser = function (req, res) {
    let token = jwt.decode(req.query.token || req.headers['x-access-token']);
    let id = token.id;
    let promise = User.findByIdAndRemove(id ,{rawResult: true}, function (err, result) {
        if (err) {
            res.status(500).json(err);
        }
        res.status(200).json(result)
    }).catch(
        function (error) {
            res.status(404).send(`The user don't exists`);
        }
    );
}

module.exports.getPostsFromUser = function (req, res) {
    let uid = req.params.id;
    let promise = Post.find({uid: uid}, {_id: false, __v:false}).populate('users');
    promise.then(
        function (posts) {
            res.status(200).json(posts);
        }
    ).catch(
        function (error) {
            res.status(404).send(`This user don't have posts!`);
        }
    )
}
