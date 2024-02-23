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

lendSchema.virtual('remainingLendingTime').get(function() {
    const maxTime = 40 * 24 * 60 * 60 * 1000
    const remainingTime = maxTime - (Date.now() - this.date.getTime())
    const remainingTimeDay = Math.floor(remainingTime / (24 * 60 * 60 * 1000))
    return remainingTimeDay
})

const lendModel = mongoose.model('Lend', lendSchema);

module.exports = lendModel;