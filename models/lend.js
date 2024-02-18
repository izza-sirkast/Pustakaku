const mongoose = require('mongoose');

const lendSchema = mongoose.Schema({
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    date: {
        type: Date,
        required: true
    }
})

const lendModel = mongoose.model('Lend', lendSchema);

module.exports = lendModel;