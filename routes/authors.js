const express = require('express');
const router = express.Router();

const authorModel = require('../models/author');
const bookModel = require('../models/book');

router.get('/', async (req, res) => {
    const searchParams = {}
    if(req.query.name && req.query.name !== ''){
        const name = new RegExp(req.query.name, 'i');
        searchParams.name = name
    }
    try{
        const authors = await authorModel.find(searchParams);
        res.render('authors/index', {authors, searchName: req.query.name});
    }catch(error) {
        res.redirect('/');
    }
})

// New route form page
router.get('/new', (req, res) => {
    res.render('authors/new', {
        author : new authorModel()
    });
})

// Post new route
router.post('/new', async (req, res) => {
    const author = new authorModel({
        name: req.body.name
    });
    try{
        const newAuthor = await author.save();
        res.redirect('/authors');
    }catch(err){
        res.render('authors/new', {
            author,
            errorMsg : 'There was an error saving the author.'
        });
    }
})

// Edit author form page
router.get('/:id/edit', async (req, res) => {
    try{
        const author = await authorModel.findById(req.params.id)
        res.render('authors/edit', {author})
    }catch{
        res.redirect(`/authors/${req.params.id}`)
    }
})

// Page to read particular author 
router.get('/:id', async (req, res) => {
    try{
        const author = await authorModel.findById(req.params.id);
        const books = await bookModel.find({author:req.params.id});
        res.render('authors/author', {
            author, 
            books, 
            error:req.flash('error')
        })
    } catch {
        res.redirect('/authors')
    }
})

// Proccess edit author
router.put('/:id', async (req, res) => {
    try{
        if(req.body.name == null && req.body.name == '') throw new Error('Name need to have atleast one character')
        const author = await authorModel.findOneAndUpdate({_id : req.params.id}, {name : req.body.name}, {new : true})
        console.log(author)
        res.redirect('/authors/'+req.params.id)
    }catch(err){
        console.log(err)
        res.redirect('/authors/'+req.params.id)
    }
})

// Process to delete author
router.delete('/:id', async (req, res) => {
    try{
        const authorsBooks = await bookModel.find({author:req.params.id})
        if (authorsBooks.length === 0){
            const deletedCount = await authorModel.deleteOne({_id: req.params.id})
        }else{
            throw new Error('Cannot delete author that still has their book listed on books data')
        }
        res.redirect('/authors')
    }catch(err){
        req.flash('error' , err.message)
        res.redirect('/authors/'+req.params.id)
    }
})


module.exports = router;