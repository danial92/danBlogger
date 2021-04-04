const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const { ensureAuthenticated } = require('../middleware/auth');
const { sendWelcomeEmail } = require('../emails/account');


const User = require("../models/user");

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const user = new User(req.body);
    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(user.password, salt, async (err, hash) => {
            if (err) throw err;
            user.password = hash;
            try {
                await user.save()
                sendWelcomeEmail(user.email, user.name);
                res.redirect('/blogs/login');
            } catch (e) {
                res.send()
            }
        })
    });
})


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/blogs/login'
    })(req, res, next)
})

router.get('/logout', (req, res) =>{
    req.logout();
    res.redirect('/blogs/login');
});

router.get('/user/avatar', ensureAuthenticated, (req, res) => {
    const userid = req.user.id
    res.render('avatar', { id: userid });
})



module.exports = router;