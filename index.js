const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const session = require('express-session')
// const flash = require('connect-flash')
const flash = require('express-flash')
const passport = require('passport')
const MongoStore = require('connect-mongo')

// Local libraries
const {passportSetup, checkAuthenticated} = require('./utils/authentication/passport-authentication')

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
const indexRoute = require('./routes/index');
const authorsRoute = require('./routes/authors');
const booksRotue = require('./routes/books')
const authenticationRoute = require('./routes/authentication')

// Database setup
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', err => console.log(err));
db.once('open', () => console.log('Connected to MongoDB...'));

app.use('/auth', authenticationRoute)
app.use('/authors', checkAuthenticated, authorsRoute);
app.use('/books', checkAuthenticated, booksRotue);
app.use('/', checkAuthenticated, indexRoute);

app.listen(process.env.PORT || 3000);
