const express = require('express')
const router = express.Router()

const bookModel = require('../../models/book')

router.get('/', async (req, res) => {
    try{
        const books = await bookModel.find()
        res.render('member/books/index', {books})
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