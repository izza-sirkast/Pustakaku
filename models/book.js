const mongoose = require('mongoose');
// const path = require('path');

// const coverImageBasePath = 'upload/coverImage';

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
    quantity: {
        type: Number,
        required: true
    },
    lendBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Member',
        default: []
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    }
})

bookSchema.virtual('coverImageRender').get(function() {
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf;base64,${this.coverImage.toString('base64')}`;
    }
})

const bookModel = mongoose.model('Book', bookSchema);

module.exports = bookModel