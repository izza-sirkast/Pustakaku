const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
    res.render('authentications/login', {layout : 'layouts/authentication-layout'})
})

router.post('/login', (req, res) => {
    console.log(req.body)
    res.redirect('/login')
})

router.get('/register', (req, res) => {
    res.render('authentications/register', {layout : 'layouts/authentication-layout'})
})

router.post('/register', (req, res) => {
    console.log(req.body)
    res.redirect('/login')
})

module.exports = router