const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const authorModel = mongoose.model('Author', authorSchema);

module.exports = authorModel;