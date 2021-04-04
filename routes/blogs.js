const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const User = require("../models/user");
require('../db/mongoose');


const { ensureAuthenticated } = require('../middleware/auth');

// Routes
router.get('/', ensureAuthenticated, async (req, res) => {
    const userid = req.user.id
    const username = req.user.name
    const params = await Blog.find({ owner: req.user._id })
    res.status(200).render('home', { articles : params, id : userid, name: username });
})


router.get('/writing', ensureAuthenticated, (req, res) => {
    res.status(200).render('writing');
})

router.get('/:id', ensureAuthenticated, async (req, res) => {
    const _id = req.params.id
    // const blog = await Blog.findById(req.params.id)
    const blog = await Blog.findOne({ _id, owner: req.user._id })
    if (blog == null) res.redirect('/home')
    res.status(200).render('ind', { blog: blog });
})


router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    const _id = req.params.id
    // const blog = await Blog.findById(req.params.id)
    const blog = await Blog.findOne({ _id, owner: req.user._id })
    res.status(200).render('edit', { blog: blog });
})

// For Deleting Blog
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    const _id = req.params.id
    // await Blog.findByIdAndDelete(req.params.id);
    await Blog.findOneAndDelete({ _id, owner: req.user._id });
    res.redirect('/home')
})

router.post('/writing', ensureAuthenticated, async (req, res, next) => {
    // req.myData = new Blog()
    req.myData = new Blog({ owner: req.user._id })
    next()
}, saveAndRedirect('writing'))

router.put('/:id', ensureAuthenticated, async (req, res, next) => {
    const _id = req.params.id
    // req.myData = await Blog.findById(req.params.id)
    req.myData = await Blog.findOne({ _id, owner: req.user._id })
    next()
}, saveAndRedirect('ind'))

function saveAndRedirect(path) {
    return async (req, res) => {
        let myData = req.myData
        myData.title = req.body.title
        myData.description = req.body.description
        myData.blog = req.body.blog
        try {
            myData = await myData.save()
            res.redirect(`/${myData.id}`)
        } catch (error) {
            res.render(`${path}`, { blog: myData })
        }
    }
}



module.exports = router