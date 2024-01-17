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
                return done(null, user)
            }else{
                return done(null, false, {message : 'Email or password incorrect'})
            }
        }catch(err){
            console.log(err)
            return done(err, false)
        }
    }

    
    passport.serializeUser(function(user, done) {
        process.nextTick(function() {
            done(null, user._id)
        })
    })
    
    passport.deserializeUser(async function(id, done) {
        const user = await userModel.findById(id) 
        process.nextTick(function() {
            return done(null, user)
        })
    })

    passport.use(new LocalStrategy({usernameField : 'email', passReqToCallback : true}, authenticateUser))
}

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        console.log('User is not authenticated')
        res.redirect('/auth/login')
    }
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        console.log('User is allready authenticated')
        res.redirect('/user')
    }
    return next()
}

module.exports = {passportSetup, checkAuthenticated, checkNotAuthenticated}