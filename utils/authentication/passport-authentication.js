const LocalStrategy = require('passport-local').Strategy
const userModel = require('../../models/user')
const bcrypt = require('bcrypt')

function passportSetup(passport){
    async function authenticateUser(email, password, done){
        try{
            const user = await userModel.findOne
            ({email : email})
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
            done(null, {id : user._id, username: user.username})
        })
    })
    
    passport.deserializeUser(function(user, done) {
        process.nextTick(function() {
            return done(null, user)
        })
    })

    passport.use(new LocalStrategy({usernameField : 'email'}, authenticateUser))
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
        res.redirect('/')
    }
    return next()
}

module.exports = {passportSetup, checkAuthenticated, checkNotAuthenticated}