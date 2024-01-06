const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const indexRoute = require('./routes/index');
const mongoose = require('mongoose');

const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// View engine setup
app.set('view engine', 'ejs');
app.set(express.static('public'));
app.set('views', __dirname+'/views');
app.set('layout', 'layouts/main-layout');
app.use(ejsLayouts);

// Database setup
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', err => console.log(err));
db.once('open', () => console.log('Connected to MongoDB...'));

app.get('/', indexRoute);

app.listen(process.env.PORT || 3000);
