const express = require('express');
const router = express.Router();
const bookModel = require('../models/book');

router.get('/', async (req, res) => {
    try {
        const books = await bookModel.find().sort({creationDate:'desc'}).limit(10).exec();
        res.render('index', {books})
    } catch (err){
        console.log(err)
        res.status(400).send('ERROR : Failed read books data');
    }
})

module.exports = router;