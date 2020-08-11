const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport'); //Same as module.exports = (passport) ==>{}
const bcrypt = require('bcryptjs');

// Load User
const User = require('../models/User');
const Tutor = require('../models/Tutor');

    //Serialize and Deserialize  
    passport.serializeUser((user, done) => {
        done(null, user.email);
    });
        
        passport.deserializeUser((email, done) => {
    
        User.findOne({where : {email} }).then(function(user) {
        
            if (user) {
        
                done(null, user.get());
        
            } else {
        
                done(user.errors, null);
        
            }
        });
    });


// module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //Match User
            User.findOne({
                where: {email: email} 
            }).then(user => {
                    if(!user) {
                        console.log('Email not registered')
                        return done(null, false, { message: 'That email is not registered ' });
                    }
                    // console.log(user);
                    

                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {message: 'Password incorrect' }); 
                        }
                    });
                })
                .catch(err => console.log(err))
        })
    );

// };

