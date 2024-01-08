const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const auhtorModel = mongoose.model('Author', authorSchema);

module.exports = auhtorModel;