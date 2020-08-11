const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//Landing Page
router.get('/', forwardAuthenticated, (req, res) => {
    let locals = {
        link: '/css/styles.css' //links to styles.css
    };
    res.render('index', locals);
});

// Parent Dashboard 
router.get('/dashboard', ensureAuthenticated ,  (req, res) => //ensureAuthenticated protects Dashboard (auth.js)
    res.render('dashboard', {
        name: req.user.fname,
        link: '/css/dashboard.css'
    })); 


module.exports = router; 