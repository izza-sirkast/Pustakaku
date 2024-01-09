const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

// Routes
const indexRoute = require('./routes/index');
const authorsRoute = require('./routes/authors');
const booksRotue = require('./routes/books')

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
    cookie: {maxAge : 1000 * 60}
}))
app.use(flash())

// Database setup
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', err => console.log(err));
db.once('open', () => console.log('Connected to MongoDB...'));

app.use('/', indexRoute);
app.use('/authors', authorsRoute);
app.use('/books', booksRotue);

app.listen(process.env.PORT || 3000);
