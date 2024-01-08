const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {bookModel, coverImageBasePath} = require('../models/book');
const authorModel = require('../models/author');

const router = express.Router();

// Cover image destination storage and filename route setup
const coverImageDest = path.join('public', coverImageBasePath);
const coverMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const upload = multer({
    dest:  coverImageDest,
    fileFilter: (req, file, callback) => {
        callback(null, coverMimeTypes.includes(file.mimetype));
    }
})

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
        res.render('books/index', {books, searchParams});
    }catch{
        res.redirect('/')
    }
})

// Create new book page
router.get('/new', async (req, res) => {
    renderFormNewBook(res, new bookModel());
})

// Process creating new book
router.post('/new', upload.single('coverImage') , async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const { title, author, publishDate, pageCount, description } = req.body;
    const book = new bookModel({
        title,
        author,
        publishDate: new Date(publishDate),
        pageCount,
        coverImage: fileName,
        description
    })
    try{
        const newBook = await book.save()
        res.redirect('/books')
    }catch(err){
        fs.unlink(path.join('public', coverImageBasePath, fileName), (err) => {
            if (err) { console.log(err) };
        })
        renderFormNewBook(res, book, true);
    }
})

module.exports = router