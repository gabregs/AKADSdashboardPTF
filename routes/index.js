const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Session Model
const Session = require('../models/Session');

//Landing Page
router.get('/', forwardAuthenticated, (req, res) => {
    let locals = {
        link: '/css/styles.css' //links to styles.css
    };
    res.render('index', locals);
});

// Parent Dashboard 
router.get('/dashboard', ensureAuthenticated ,  (req, res) => //ensureAuthenticated protects Dashboard (auth.js)
    
    Session.findAll({where: {parent_email: req.user.email} })
    .then(session => {
        res.render('dashboard', {
            sessions: session,
            name: req.user.fname,
            link: '/css/dashboard.css'
        });
        console.log(session);
    }).catch ((err) => {
        throw new Error(error);
    })

); 

// Tutor Dashboard
router.get('/tutordashboard', ensureAuthenticated, (req, res) =>
    res.render('tutordashboard', {
        name: req.user.fname,
        link: '/css/dashboard.css'
    }));



module.exports = router; 