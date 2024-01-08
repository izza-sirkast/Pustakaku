const express = require('express');
const router = express.Router();

const authorModel = require('../models/author');

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

module.exports = router;