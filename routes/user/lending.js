const express = require('express')
const router = express.Router()

const bookModel = require('../../models/book')
const memberModel = require('../../models/member')
const lendModel = require('../../models/lend')

router.get('/', async (req, res) => {
    try {
        const lends = await lendModel.find().populate('book').populate('lender')
        res.render('user/lending/index', {lends})
    } catch (error) {
        console.log(error)
        res.redirect('/user')
    }
})

router.get('/new', async (req, res) => {
    try {
        const members = await memberModel.find()
        const books = await bookModel.find().populate('author')
        res.render('user/lending/new', {members, books})
    } catch (error) {
        console.log(error)
        res.redirect('/user/lending')
    }
})

router.post('/new', async(req, res) => {
    const {bookId, lenderId} = req.body
    try {
        const newLend = new lendModel({
            lender: lenderId,
            book: bookId,
            date: new Date()
        })
        await newLend.save()
        req.flash('lendSuccess', 'New lend has been created successfully')
        res.redirect('/user')
    } catch (error) {
        console.log(error)
        res.redirect('/user/lending/new')
    }
})

router.get('/new/:id', async (req, res) => {
    try {
        const book = await bookModel.findById(req.params.id)
        const members = await memberModel.find()
        res.render('user/lending/new', {book, members})
    } catch (error) {
        res.redirect('/user/lending')
    }
    

})

module.exports = router