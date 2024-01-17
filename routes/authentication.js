const express = require('express')
const router = express.Router()
const userModel = require('../models/user.js')
const bcrypt = require('bcrypt')
const passport = require('passport')

// Local libraries
const {checkNotAuthenticated} = require('../utils/authentication/passport-authentication.js')

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('authentications/login', {layout : 'layouts/authentication-layout'})
})

router.post('/login', passport.authenticate('local', {
    successRedirect : '/user',
    failureRedirect : '/auth/login',
    failureFlash : true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('authentications/register', {layout : 'layouts/authentication-layout'})
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
    try{
        const encryptedPass = await bcrypt.hash(req.body.password, 10)
        const user = new userModel({
            username : req.body.username,
            email : req.body.email,
            password : encryptedPass
        })
        await user.save()
        res.redirect('/auth/login')
    }catch(err){
        console.log(err)
        res.redirect('/auth/login')
    }
})

router.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if(err) {return next(err)}
        res.redirect('/auth/login')
    })
})

module.exports = router