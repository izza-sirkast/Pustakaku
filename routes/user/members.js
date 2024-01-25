const express = require('express')
const router = express.Router()
const memberModel = require('../../models/member')
const bcrypt = require('bcrypt')

router.get('/', async (req, res) => {
    const searchParams = {}
    let query = memberModel.find()
    if(req.query.name && req.query.name !== ''){
        searchParams.name = req.query.name
        const name = new RegExp(req.query.name, 'i')
        query = query.regex('name', name)
    }    
    try{
        const members = await query.exec()
        res.render('user/members/index', {members, searchParams})
    }catch(err){
        console.log(err)
        res.redirect('/user')
    }
})

router.get('/add', (req, res) => {
    res.render('user/members/new')
})

router.post('/add', async (req, res) => {
    try{
        const { name, email, password } = req.body
        const member = new memberModel({
            name,
            email,
            password : await bcrypt.hash(password, 10) 
        })
        await member.save()
        req.flash('success', 'New member has been created successfully')
        res.redirect('/user/members')
    }catch(err){
        console.log(err)
        req.flash('error', 'Failed to create new member')
        res.redirect('/user/members/add')
    }

})

router.get('/edit/:id', async (req, res) => {
    try{
        const member = await memberModel.findById(req.params.id)
        res.render('user/members/edit', {member})
    }catch(err){
        console.log(err)
        res.redirect('/user/members/'+req.params.id)
    }
})

router.put('/edit/:id', async (req, res) => {
    try{
        const member = await memberModel.findByIdAndUpdate(req.params.id, {...req.body}, {new: true})
        req.flash('success', 'Member has been updated successfully')
        res.redirect('/user/members/'+req.params.id)
    }catch(err){
        req.flash('error', 'Failed to update member')
        res.redirect('/user/members/'+req.params.id)
    }
})

router.get('/:id', async (req, res) => {
    try{
        const member = await memberModel.findById(req.params.id)
        res.render('user/members/member', {member})
    }catch(err){
        console.log(err)
        res.redirect('/user/members')
    }
})

router.delete('/delete/:id', async (req, res) => {
    try{
        await memberModel.findByIdAndDelete(req.params.id)
        req.flash('success', 'Member has been deleted successfully')
        res.redirect('/user/members')
    }catch(err){
        console.log(err)
        req.flash('error', 'Failed to delete member')
        res.redirect('/user/members')
    }
})

module.exports = router