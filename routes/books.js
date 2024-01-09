const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
const bookModel = require('../models/book');
const authorModel = require('../models/author');

const router = express.Router();

const coverMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
// Cover image destination storage and filename route setup, using multer save in folder
// const coverImageDest = path.join('public', coverImageBasePath);
// const upload = multer({
//     dest:  coverImageDest,
//     fileFilter: (req, file, callback) => {
//         callback(null, coverMimeTypes.includes(file.mimetype));
//     }
// })

// To render book form
async function renderFormNewBook(res, bookModel, error = false){
    try {
        const authors = await authorModel.find({});
        const renderData = {book: bookModel, authors};
        if (error){
            renderData.error = 'Error: Create new book failed';
        }
        res.render('books/new', renderData); 
    } catch {
        res.redirect('/books');
    }
}

// Books listing page
router.get('/', async (req, res) => {
    let query = bookModel.find();
    const searchParams = {};
    if (req.query.title != null && req.query.title != ''){
        searchParams.title = req.query.title;
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != ''){
        searchParams.publishedAfter = req.query.publishedAfter;
        query = query.gte('publishDate', req.query.publishedAfter);
    }
    if (req.query.publishedBefore != null  && req.query.publishedBefore != ''){
        searchParams.publishedBefore = req.query.publishedBefore;
        query = query.lte('publishDate', req.query.publishedBefore);
    }

    try{
        const books = await query.exec();
        res.render('books/index', {
            books, 
            searchParams,
            successMessage : req.flash('deleteSuccess')
        });
    }catch{
        res.redirect('/')
    }
})

// Create new book page
router.get('/new', async (req, res) => {
    renderFormNewBook(res, new bookModel());
})

// Process creating new book
router.post('/new', /*upload.single('coverImage') , */ async (req, res) => {
    //const fileName = req.file != null ? req.file.filename : null;
    const { title, author, publishDate, pageCount, description, coverImage } = req.body;
    const book = new bookModel({
        title,
        author,
        publishDate: new Date(publishDate),
        pageCount,
        description
    })
    try{
        saveCoverImage(book, coverImage)
        const newBook = await book.save()
        res.redirect('/books')
    }catch{
        // Directly delete file image when there's an error
        // fs.unlink(path.join('public', coverImageBasePath, fileName), (err) => {
        //     if (err) { console.log(err) };
        // })
        renderFormNewBook(res, book, true);
    }
})

// Routing to edit book form
router.get('/:id/edit', async (req, res) => {
    try{
        const book = await bookModel.findById(req.params.id)
        const authors = await authorModel.find()
        res.render('books/edit', {
            book,
            authors
        })
    }catch{
        red.redirect('/books/'+req.params.id)
    }
})

// See book data
router.get('/:id', async (req, res) => {
    try{
        const book = await bookModel.findById(req.params.id).populate('author').exec()
        res.render('books/book', {
            book,
            deleteError : req.flash('deleteError')
        })
    }catch{
        res.redirect('/books')
    }
})

// Delete book process
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await bookModel.findOneAndDelete({_id : req.params.id})
        req.flash('deleteSuccess', 'Book is deleted successfully')
        res.redirect('/books')
    } catch  {
        req.flash('deleteError', 'Error : failed to delete the book')
        res.redirect('/books/'+req.params.id)
    }
})


const saveCoverImage = (book, coverImage) => {
    if(coverImage == null) throw new Error;
    const coverImageData = JSON.parse(coverImage)
    if(coverImageData != null && coverMimeTypes.includes(coverImageData.type)){
        book.coverImage = new Buffer.from(coverImageData.data, 'base64')
        book.coverImageType = coverImageData.type
    }else{
        throw new Error;
    }
}

module.exports = router