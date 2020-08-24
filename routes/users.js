const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const sequelize = require('sequelize');
const thenrequest = require('then-request');
const path = require('path');
const async = require('async');
const jwt = require('jsonwebtoken');
const config = require('../config');


//ZOOM API KEYS
var zoom_key = config.APIKey;
var zoom_sec = config.APISecret;

// All models
const User = require('../models/User');
const Request = require('../models/Request');
const Tutor = require('../models/Tutor');
const Session = require('../models/Session');
const { response } = require('express');
const { getMaxListeners } = require('process');

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
router.post('/login', (req , res, next ) => { ; 
  passport.authenticate('user-local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Tutor Login Handle
router.post('/tutorlogin', (req , res, next ) => { ; 
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
    is_taken: 0 
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
      req.flash('success_msg', 'Your request has been sent. Please wait for us to match you with your tutor.');
      res.redirect('/dashboard');
    }) 
    .catch(err => console.log(err));
  }
});

//------------------------------------------------New Requests for tutor
router.get('/requests', (req, res) => {
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
      filterRequests.then( (result) => {
        res.render('requests', {
          requests: result,
          link: '/css/dashboard.css'
        });
      })
      });
      console.log('found requests');
   });

// ---------------------------------------------------- Accept Request handle
router.post('/acceptrequest', (req, res) => {

  Request.findOne({where: {request_id: req.body.request_id}})
  .then(request => {
    
    if (!request) {
      throw new Error('No request found')
    }
  
    // console.log(`retrieved request ${JSON.stringify(request,null,2)}`) 
  
    let values = {
      tutor_email: req.session.passport.user,
      is_taken: 1
    }
    
    request.update(values).then(updatedRequest => {
    // console.log(`updated request ${JSON.stringify(updatedRequest,null,2)}`);
      delete request.dataValues.request_id;
      delete request.dataValues.is_taken;
      Tutor.findOne({where: {email: req.session.passport.user}, raw: true})
      .then((result) => {
        (async () => {
          const tutorname = `${result.fname} ${result.lname}` ;
          const newsession = await Session.create(request.dataValues);
          newsession.tutor_name = tutorname;
          await newsession.save();
        })();

      }).catch((error) => {
        throw new Error(error)
      });      
    }).catch((error) => {
      throw new Error(error)
    });
  })
  .catch((error) => {
    throw new Error(error)
  });
  req.flash('success_msg', 'Session accepted. Please check the dashboard.');
  res.redirect('/users/requests');
});

//-----------------------------------Checkout
router.post('/checkout', (req, res) => {

  Session.findOne({ where: { session_id: req.body.request_id }})
        .then(currentSession => {
              
              var request = require("request");

              var options = {
                method: 'POST',
                url: 'https://api.paymongo.com/v1/payment_intents',
                headers: {
                  'content-type': 'application/json',
                  authorization: 'Basic c2tfdGVzdF9KdzJHY05kN2l1U3p5VHVOMlZRenF4Vlo6'
                },
                body: {
                  data: {
                    attributes: {
                      amount: currentSession.session_duration * 50000 ,
                      payment_method_allowed: ['card'],
                      payment_method_options: {card: {request_three_d_secure: 'any'}},
                      currency: 'PHP',
                      description: 'hatdog',
                      statement_descriptor: 'hatdog'
                    }
                  }
                },
                json: true
              };
              
              request(options, function (error, response, body) {
                if (error) throw new Error(error);
                // console.log(body);
                 res.render('checkout', {
                  intentPayment : body,
                  currentSession : currentSession,
                  link: '/css/dashboard.css' });
                // const intentPayment = body;
                // res.json(intentPayment);               
              });     
        });
});

//-------------------------------- Checkout get

router.get('/checkout', (req, res) => {
  // console.log(req);
  // Session.findOne({ where: { session_id: req.body.currentSession.session_id}})
  //       .then(currentSession => {
  //         res.render('checkout', {
  //           currentSession : currentSession,
  //           link: '/css/dashboard.css' });           
  //       });
});

//---------------------------------Submit Payment
router.post('/submitpayment',(req, response )=>{
  // console.log(req.body);
  const userid = "sQIhuYNJSLim9GvTyWMB8g";
    Session.findOne({where: {session_id: req.body.session_id}})
        .then((session) => {
          
          if(!session) {
            throw new Error('No session found')
          }
          
          // Create meeting with POST to ZOOM
          var Moptions = {
              "topic": session.topic,
              "type": 1,
              "start_time": session.tutorial_date.concat(session.tutorial_time),
              "duration": "",
              "schedule_for": "",
              "timezone": "HK",
              "password": "",
              "agenda": "",
              "settings": {
                "host_video": true,
                "participant_video": true,
                "cn_meeting": true,
                "in_meeting": false,
                "join_before_host": true,
                "mute_upon_entry": false,
                "watermark": true,
                "use_pmi": false,
                "approval_type": 0,
                "registration_type": 1,
                "audio": "both",
                "auto_recording": "none",
                "enforce_login": false,
                "enforce_login_domains": "",
                "alternative_hosts": "",
                "global_dial_in_countries": [                     
                ],
                "registrants_email_notification": true
              }
          };
        
          var http = require("https");

              var options = {
                "method": "POST",
                "hostname": "api.zoom.us",
                "port": null,
                "path": "/v2/users/sQIhuYNJSLim9GvTyWMB8g/meetings",
                "headers": {
                  "content-type": "application/json",
                  "authorization": "Bearer eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiJhMjY4MjI5Yy0xMWIyLTRhMTYtYTJmNi0zMDc1ODU4MjZjMjcifQ.eyJ2ZXIiOjcsImF1aWQiOiI3NWRmNDhjNDk5MzY0ZWUyYjRiNmU5MWQyYWE4ZjJmZiIsImNvZGUiOiJlcWJuMnAzN0N6X3NRSWh1WU5KU0xpbTlHdlR5V01COGciLCJpc3MiOiJ6bTpjaWQ6VWM0REFON0ZRR09oalYwTHNEMW9lZyIsImdubyI6MCwidHlwZSI6MCwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJzUUlodVlOSlNMaW05R3ZUeVdNQjhnIiwibmJmIjoxNTk3NzYwNzAwLCJleHAiOjE1OTc3NjQzMDAsImlhdCI6MTU5Nzc2MDcwMCwiYWlkIjoiQ1lRME03TFZUQk93Qm43bVVwckI2USIsImp0aSI6ImY4MzMzZDdkLTQxMjktNGU3ZS1hZjU4LTk5NWQwNDQ0YzdkNiJ9.aEM33r_IQt0XbOIfSTmqoY6LqajnLELs36U0fdE5vBlB8RgfgqFOl_30ZFPYxWDme89x6zGAR6fTd0TVuUQmrQ"
                }
              };

              var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                  chunks.push(chunk);
                });

                res.on("end", function () {
                  var body = Buffer.concat(chunks);
                  // console.log(body.toString());

                  const obj = JSON.parse(body.toString());

                  let values = {
                    zoomstart: "https://us02web.zoom.us/j/3898887441?pwd=L3kzOXhvVWdneWNwNkJWSk55WUYyUT09",
                    zoomjoin: "https://us02web.zoom.us/j/3898887441?pwd=L3kzOXhvVWdneWNwNkJWSk55WUYyUT09",
                    ispaid: 1
                  }

                  session.update(values).then(updatedSession => {
                    response.redirect('/dashboard');
                  });

                });
              });

              req.write(JSON.stringify(Moptions));
              req.end();



          });
});

//---------------------------------Finish Session
router.post('/finishSession',(req,res) =>{
    // console.log(req.body);
    Session.findOne({where: {session_id: req.body.session_id}})
      .then((session) => {
        let values ={
          isdone: 1
        }

        session.update(values).then(updatedSession =>{
            res.redirect(`${session.zoomstart}`);
        })
      });
});
  

module.exports = router;