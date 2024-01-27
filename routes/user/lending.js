const express = require('express')
const router = express.Router()

const bookModel = require('../../models/book')
const memberModel = require('../../models/member')

router.get('/', async (req, res) => {
    try {
        const availableBooks = await bookModel.find({available : true})
        res.render('user/lending/index', {books : availableBooks})
    } catch (error) {
        console.log(error)
        res.redirect('/user')
    }
})

router.get('/new', async (req, res) => {
    try {
        const members = await memberModel.find()
        const books = await bookModel.find()
        res.render('user/lending/new', {members, books})
    } catch (error) {
        console.log(error)
        res.redirect('/user/lending')
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