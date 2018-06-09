const mongoose = require('mongoose');

module.exports = function () {
    const schema = mongoose.Schema({
        text: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
            required: true,
            default: 0
        },
        uid: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            require: true
        }
    })
    return mongoose.model('Post', schema);
}();