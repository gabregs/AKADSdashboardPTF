const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Database
const db = require('./config/database')

//Test DB
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('error ' + err ))

const app = express();

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Middlewear to connect ejs to css and images in public folder
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

// Bodyparser
app.use(express.urlencoded( { extended: false }));

// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//Passport config
require('./config/passport');
// Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));