let mongoose = require('mongoose');

module.exports = function () {
    let schema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            index: true,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    })
    return mongoose.model('User', schema);
}();