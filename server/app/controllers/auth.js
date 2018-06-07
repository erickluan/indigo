let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

let User = require('../models/user');

module.exports.signin = function (req, res) {
    let promise = User.findOne({email: req.body.email}).exec();
    promise.then(
        function (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign({id: user._id}, 'utAIgD2JoBrO4tEGEc5iMpYXMzLNDW8z');
                res.status(200).json({
                    id: user._id,
                    token: token,
                    message: 'Logged'
                });
            } else {
                res.status(401).send('Invalid Login');
            }
        }
    ).catch(
        function () {
            res.status(401).send('Invalid Login2');
        }
    )
}

module.exports.verifyAccessToken = function (req, res, next) {
    jwt.verify(req.headers['x-access-token'], 'utAIgD2JoBrO4tEGEc5iMpYXMzLNDW8z', function (err, decoded) {
        if (err) {
            res.status(401).json({
                message: 'Not Authorized'
            })
        } else {
            next()
        }
    })
}