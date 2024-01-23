const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const MongoStore = require('connect-mongo')

// Local libraries
const {passportSetup, checkAuthenticated, checkIsStaff, checkIsMember} = require('./utils/authentication/passport-authentication')

const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


// View engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.set('layout', 'layouts/main-layout');
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(ejsLayouts);
app.use(express.urlencoded({ limit : '50mb', extended: true }));
app.use(express.json({limit : '50mb'}));
app.use(session({
    secret: 'theonepieceisreal123',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL,
        dbName: 'pustakaku'
    })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'))
app.use(flash())

// Initialize passport setup
passportSetup(passport)

// Routes
// ======================================================
// Authentication
const authenticationRoute = require('./routes/authentication')

// Staff
const indexRoute = require('./routes/user/index');
const authorsRoute = require('./routes/user/authors');
const booksRotue = require('./routes/user/books')
const membersRoute = require('./routes/user/members')
const lendingRoute = require('./routes/user/lending')

// Member
const memberDashboardRoute = require('./routes/member/dashboard')
const memberBooksRoute = require('./routes/member/books')


// Database setup
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', err => console.log(err));
db.once('open', () => console.log('Connected to MongoDB...'));

app.use('/auth', authenticationRoute)

// Route for staff
app.use('/user/authors', checkIsStaff, authorsRoute);
app.use('/user/books', checkIsStaff, booksRotue);
app.use('/user/members', checkIsStaff, membersRoute)
app.use('/user/lending', checkIsStaff, lendingRoute)
app.use('/user', checkIsStaff, indexRoute);
app.get('/', checkIsStaff, (req, res) => {
    res.redirect('/user')
})

// Route for member
app.use('/member', chooseLayout('member'), checkIsMember, memberDashboardRoute);
app.use('/member/books', checkIsMember, memberBooksRoute)

// Middleware to choose the layout based on the route / user
function chooseLayout(route){
    return (req, res, next) => {
        res.locals.layout = `layouts/${route}-layout`
        next()
    }
}

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening to server at http://localhost:3000')
});
