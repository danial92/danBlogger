// Express App
const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config();

// Additional
const bodyParser = require('body-parser');
const path = require('path')
const port = 8000; // PORT

const database = require('./db/mongoose');

database()

// Passport Authentication
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
require('./passport/passport')(passport);

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

// Importing method-override
const methodOverride = require("method-override");
app.use(methodOverride('_method'));

// Express 
app.use('static', express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }))

// Importing Router
const blogRouter = require("./routes/blogs");
const userRouter = require("./routes/users");
// Connecting Router
app.use('/', blogRouter);
app.use('/blogs', userRouter);


// Pug
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));


// Server
app.listen(port, () => console.log(`Our app listening at http://localhost:${port}`))