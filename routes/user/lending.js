const express = require('express')
const router = express.Router()

const bookModel = require('../../models/book')
const memberModel = require('../../models/member')
const lendModel = require('../../models/lend')

router.get('/', async (req, res) => {
    try {
        const lends = await lendModel.find().populate('book').populate('lender').sort({date: -1})
        res.render('user/lending/index', {lends})
    } catch (error) {
        console.log(error)
        res.redirect('/user')
    }
})

router.post('/', async (req, res) => {
    const {lendId, bookId, lenderId} = req.body
    try {
        // remove lender from book
        await bookModel.updateOne(
            { _id : bookId },
            { $pull : { lendBy : lenderId }}
        )

        // remove lend document
        await lendModel.deleteOne({ _id : lendId })
        
        req.flash('returnSuccess', 'Book has been returned successfully')
        res.redirect('/user/lending')
    } catch (error) {
        console.log(error)
        req.flash('returnFailed', 'Error: cannot return book')
        res.redirect('/user/lending')
    }
})

router.get('/new', (req, res) => {
    res.redirect('/user/lending/new/pick')
})

router.get('/new/:id', async (req, res) => {
    try {
        const members = await memberModel.find()
        const books = await bookModel.find().populate('author')
        if(req.params.id == 'pick'){
            res.render('user/lending/new', {members, books, book : false})
        }else{
            const book = await bookModel.findById(req.params.id).populate('author')
            res.render('user/lending/new', {members, books, book})
        }
    } catch (error) {
        console.log(error)
        res.redirect('/user/lending')
    }
})


router.post('/new', async(req, res) => {
    const {bookId, lenderId} = req.body
    try {
        // Add new lender to the book lendBy property
        await bookModel.updateOne(
            { _id : bookId },
            { $push : { lendBy: lenderId }}
        )

        // Add new lend data to the database
        const newLend = new lendModel({
            lender: lenderId,
            book: bookId,
            date: new Date()
        })
        await newLend.save()

        req.flash('lendSuccess', 'New lend has been created successfully')
        res.redirect('/user/lending')
    } catch (error) {
        console.log(error)
        res.redirect('/user/lending/new')
    }
})



module.exports = router