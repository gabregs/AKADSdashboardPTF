const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User')

// Login Page
router.get('/login', (req, res) => res.render('login', {link: '/css/styles.css'}));

// Register Page
router.get('/regone', (req, res) => res.render('regone', {link: '/css/styles.css'} ));

//Register Parent
router.get('/regtwo', (req, res) => res.render('regtwo', {link: '/css/styles.css'}))

// Register Handle
router.post('/register', (req, res) => {
    const { email, fname, lname, password, password2 } = req.body;

    let errors = [];

    //Check required fields
    if (!email ||!fname || !lname || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
      }
    
      if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
      }
    
      if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
      }
    
      if (errors.length > 0) {
        res.render('regtwo', {
          errors,
          email,
          fname,
          lname,
          password,
          password2,
          link: '/css/styles.css'
        });
    } else {
        // Validation passed
        User.findOne({ where: {email: email} })
            .then(user => {
                if(user) {
                    // User Exists
                    errors.push({ msg: 'Email is already registered'});
                    res.render('regtwo', {
                        errors,
                        email,
                        fname,
                        lname,
                        password,
                        password2,
                        link: '/css/styles.css'
                      });
                } else {
                    const newUser = new User({
                        email,
                        fname,
                        lname,
                        password
                    });

                    //Hash password
                    bcrypt.genSalt(10, (err,salt) => bcrypt.hash(newUser.password, salt, (err,hash) => {
                      if(err) throw err;
                      //Set password to hashed
                      newUser.password = hash;
                      //Save user
                      newUser.save()
                      .then(user => {
                        req.flash('success_msg', 'Account Created! Please check your email to confirm your account.');
                        res.redirect('/users/login');
                      }) 
                      .catch(err => console.log(err));
                    })) 
                }
            });
    }
});

// Login Handle
router.post('/login', (req , res, next ) => { console.log(req.body);
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
})


module.exports = router;