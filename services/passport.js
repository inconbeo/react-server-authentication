'use strict';

const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create local strategy
//Local strategy expect to have username so we pass email to the usernameField property
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  //Verify email and password, call done with the user if this is the correct username and password
  //otherwise, call done with false
  User.findOne({email: email}, function(err, user) {
    if (err) {return done(err);}
    if (!user) {return done(null, false);}

    //compare passwords is 'password'(supplied by request) equal to user.password
    user.comparePassword(password, function(err, isMatch) {
      if (err) {return done(err);}
      if (!isMatch) {return done(null, false);}
      return done(null, user);//PASSPORT WILL ASSIGN THIS USER TO REQ.USER
    });

  });
});


//Setup options for JWT Strategy
//JWT could be placed in many places, we need tell passport where to look for JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//Create JWT strategy from passport-jwt library
//payload is the decoded JWT token
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in the DB,
  // If it does, call "done" with that user
  //Otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    //If  search fail or we cannot access to the DB
    if (err) {return done(err, false);}

    //if there is user, call null  (no err) and with user
    if (user) {
      done(null, user);
      //if not found, call done with null and false (no user)
    } else {
      done(null, false);
    }
  });
});

//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);