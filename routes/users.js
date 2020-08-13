const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');
const Request = require('../models/Request');
const Tutor = require('../models/Tutor');
const Session = require('../models/Session');

// Login Parent Page
router.get('/login', (req, res) => res.render('login', {link: '/css/styles.css'}));

// Login Tutor Page
router.get('/tutorlogin', (req, res) => res.render('tutorlogin', {link: '/css/styles.css'}));

// Register Page
router.get('/regone', (req, res) => res.render('regone', {link: '/css/styles.css'} ));

//Register Tutor
router.get('/tutorappone', (req, res) => res.render('tutorappone', {link: '/css/styles.css'} ));

//Register Tutor Submitted
router.get('/tutorapptwo', (req, res) => res.render('tutorapptwo', {link: '/css/styles.css'} ));

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

// Register Tutor Handle
router.post('/tutorapp', (req, res) => {
  const { fname, lname, password, password2, email, subject, tutor_experience, gov_id, transcript } = req.body;

  let errors = [];

  //Check required fields
  if (!email ||!fname || !lname || !password || !password2 ||!subject || !tutor_experience || !gov_id || !transcript ) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('tutorappone', {
        errors,
        fname,
        lname,
        password, 
        password2, 
        email, 
        subject, 
        tutor_experience, 
        gov_id, 
        transcript,
        link: '/css/styles.css'
      });
  } else {
      // Validation passed
      Tutor.findOne({ where: {email: email} })
          .then(tutor => {
              if(tutor) {
                  // Tutor Exists
                  errors.push({ msg: 'Email is already registered'});
                  res.render('tutorappone', {
                    errors,
                    fname,
                    lname,
                    password, 
                    password2, 
                    email, 
                    subject, 
                    tutor_experience, 
                    gov_id, 
                    transcript,
                    link: '/css/styles.css'
                    });
              } else {
                  const newTutor = new Tutor({
                    fname,
                    lname,
                    password, 
                    password2, 
                    email, 
                    subject, 
                    tutor_experience, 
                    gov_id, 
                    transcript,
                    isaccepted: 1 //// Default true, will change after tutor dashboard
                  });

                  //Hash password
                  bcrypt.genSalt(10, (err,salt) => bcrypt.hash(newTutor.password, salt, (err,hash) => {
                    if(err) throw err;
                    //Set password to hashed
                    newTutor.password = hash;
                    //Save tutor
                    newTutor.save()
                    .then(tutor => {
                      req.flash('success_msg', 'Account Created! Please check your email to confirm your account.');
                      res.redirect('/users/tutorapptwo');
                    }) 
                    .catch(err => console.log(err));
                  })) 
              }
          });
  }
});

// Parent Login Handle
router.post('/login', (req , res, next ) => { ; console.log(req.body)
  passport.authenticate('user-local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Tutor Login Handle
router.post('/tutorlogin', (req , res, next ) => { ; console.log(req.body)
  passport.authenticate('tutor-local', {
    successRedirect: '/tutordashboard',
    failureRedirect: '/users/tutorlogin',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
})


// Find Tutor 
router.get('/findtutor', (req, res) => {
  res.render('findtutor' , { link: '/css/dashboard.css'});
});

// Find Tutor Handle
router.post('/findtutor', (req, res) => {

  const { student_name, grade_level, subject, topic, session_duration, tutorial_date, tutorial_time, special_requests } = req.body;

  const newRequest = new Request({
    parent_email: req.session.passport.user,
    student_name,
    grade_level, 
    subject, 
    topic, 
    session_duration, 
    tutorial_date, 
    tutorial_time, 
    special_requests,
    is_taken: 0 // Default true, will change after tutor dashboard
});

  let errors = [];

  //Check required fields
  if (!student_name || !grade_level || !subject || !topic ||!session_duration || !tutorial_date || !tutorial_time ) {
      errors.push({ msg: 'Please enter all fields' });
      res.render('findtutor', {
        errors,
        student_name,
        grade_level, 
        subject, 
        topic, 
        session_duration, 
        tutorial_date, 
        tutorial_time, 
        special_requests,
        link: '/css/dashboard.css'
    });
   } else {
    newRequest.save()
    .then(request => {
      res.redirect('/dashboard');
    }) 
    .catch(err => console.log(err));
  }
});

//New Requests for tutor
router.get('/requests', (req, res) => {
    console.log('fish');
    Tutor.findOne( { where: { email: req.session.passport.user } } ) 
    .then(tutor => {
      if (!tutor) {
        console.log('Not found');
      }
      const filterRequests = Request.findAll({
          where: {
            is_taken: 0,
            subject: tutor.subject
          },
            raw:true,
        }).catch(function(err){
            console.log(err);
        });
      filterRequests.then(function(result) {
        res.render('requests', {
          requests: result,
          link: '/css/dashboard.css'
        });
      })
      });
   });

//Accept Request handle
router.post('/acceptrequest', (req, res) => {

  Request.findOne({where: {request_id: req.body.request_id}})
  .then(request => {
    
    if (!request) {
      throw new Error('No request found')
    }
  
    console.log(`retrieved request ${JSON.stringify(request,null,2)}`) 
  
    let values = {
      tutor_email: req.session.passport.user,
      is_taken: 1
    }
    
    request.update(values).then( updatedRequest => {
    console.log(`updated request ${JSON.stringify(updatedRequest,null,2)}`);
    delete request.dataValues.request_id;
    delete request.dataValues.is_taken;
    Session.create(request.dataValues);
    });
  })
  .catch((error) => {
    // do seomthing with the error
    throw new Error(error)
  });
  req.flash('success_msg', 'Session accepted. Please check the dashboard.');
  res.redirect('/users/requests');
});


module.exports = router;