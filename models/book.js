const mongoose = require('mongoose');

const coverImageBasePath = 'upload/coverImage';

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now(),
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    }
})

const bookModel = mongoose.model('Book', bookSchema);

module.exports = {bookModel, coverImageBasePath}