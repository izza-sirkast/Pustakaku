const express = require('express')
const router = express.Router()
const authorModel = require('../../models/author')
const bookModel = require('../../models/book')

router.get('/', async (req, res) => {
    const searchParams = {}
    if(req.query.name && req.query.name !== ''){
        const name = new RegExp(req.query.name, 'i');
        searchParams.name = name
    }
    try{
        const authors = await authorModel.find(searchParams);
        res.render('member/authors/index', {authors, searchName: req.query.name});
    }catch(error) {
        res.redirect('/user');
    }
})

router.get('/:id', async (req, res) => {
    try {
        const author = await authorModel.findById(req.params.id)
        const books = await bookModel.find({author: req.params.id})
        res.render('member/authors/author', {author, books})
    } catch (error) {
        res.redirect('/member/authors')
    }
})

module.exports = router