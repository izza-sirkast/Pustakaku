const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    memberType: {
        type: String,
        required: true,
        enum: ['bronze', 'silver', 'gold']
    }
})

const memberModel = mongoose.model('Member', memberSchema)

module.exports = memberModel