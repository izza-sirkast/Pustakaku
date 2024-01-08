const mongoose = require('mongoose');
const path = require('path');

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

bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImage != null){
        return path.join('/', coverImageBasePath, this.coverImage);
    }
})

const bookModel = mongoose.model('Book', bookSchema);

module.exports = {bookModel, coverImageBasePath}