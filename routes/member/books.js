const express = require('express')
const router = express.Router()

const bookModel = require('../../models/book')
const authorModel = require('../../models/author')

router.get('/', async (req, res) => {
    const searchParams = {}
    let bookQuery = bookModel.find()

    if(req.query.title != null && req.query.title != ''){
        searchParams.title = req.query.title
        bookQuery = bookQuery.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        searchParams.publishedBefore = req.query.publishedBefore
        bookQuery = bookQuery.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        searchParams.publishedAfter = req.query.publishedAfter
        bookQuery = bookQuery.gte('publishDate', req.query.publishedAfter)
    }
    if(req.query.author != null && req.query.author != ''){
        searchParams.author = req.query.author
        bookQuery = bookQuery.find({'author' : req.query.author})
    }

    try{
        const books = await bookQuery.exec()
        const authors = await authorModel.find()
        res.render('member/books/index', {books, authors, searchParams})
    }catch(err){
        res.redirect('/member')
    }

})

router.get('/:id', async (req, res) => {
    try{
        const book = await bookModel.findById(req.params.id)
        res.render('member/books/book', {book})
    }catch(err){
        res.redirect('/member/books')
    }
})

module.exports = router