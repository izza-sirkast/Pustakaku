const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const userModel = require('../../models/user')
const memberModel = require('../../models/member')

function passportSetup(passport){
    async function authenticateUser(req, email, password, done){
        const loginAs = req.body.loginAs
        try{
            let user;
            if (loginAs == 'staff') {
                user = await userModel.findOne({email : email})
            }else if(loginAs == 'member'){
                user = await memberModel.findOne({email : email})
            }
            if (user == null) {
                return done(null, false, {message : 'Email or password incorrect'})
            }else if(await bcrypt.compare(password, user.password)){
                return done(null, {user, loginAs})
            }else{
                return done(null, false, {message : 'Email or password incorrect'})
            }
        }catch(err){
            console.log(err)
            return done(err, false)
        }
    }

    
    passport.serializeUser(function(data, done) {
        process.nextTick(function() {
            done(null, {id: data.user._id, loginAs: data.loginAs})
        })
    })
    
    passport.deserializeUser(async function(data, done) {
        let user;
        // If login as staff
        if (data.loginAs == 'staff') {
            user = await userModel.findById(data.id) 
            process.nextTick(function() {
                return done(null, {
                    id : user._id,
                    name : user.username,
                    email : user.email,
                    loginAs : data.loginAs})
            })
            // If login as member
        }else if(data.loginAs == 'member'){
            member = await memberModel.findById(data.id)
            process.nextTick(function() {
                return done(null, {
                    id : member._id,
                    name : member.name,
                    email : member.email,
                    loginAs : data.loginAs})
            })
        }
    })

    passport.use(new LocalStrategy({usernameField : 'email', passReqToCallback : true}, authenticateUser))
}

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        console.log('User is not authenticated')
        return res.redirect('/auth/login')
    }
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        console.log('User is allready authenticated')
        return res.redirect('/user')
    }
    return next()
}

// For checking if user is a staff
function checkIsStaff(req,res,next){
    if(req.isAuthenticated() && req.user.loginAs == 'staff'){
        return next()
    }else if(!req.isAuthenticated()){
        console.log('User is not authenticated')
        res.redirect('/auth/login')
    }else{
        if(req.user.loginAs == 'member'){
            res.redirect('/member')
        }
    }
}

// For checking if user is a member
function checkIsMember(req,res,next){
    if(req.isAuthenticated() && req.user.loginAs == 'member'){
        return next()
    }else if(!req.isAuthenticated()){
        console.log('User is not authenticated')
        res.redirect('/auth/login')
    }else{
        if(req.user.loginAs == 'staff'){
            res.redirect('/user')
        }
    }
}

module.exports = {passportSetup, checkAuthenticated, checkNotAuthenticated, checkIsStaff, checkIsMember}