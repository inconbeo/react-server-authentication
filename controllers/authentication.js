'use strict';
const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  //sub(subject) means who is this token belong to, the subject of this token is user ID
  //iat means "issued at timestamp"
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

exports.signin = function(req, res, next) {
  //User has already had their email and password authenticated
  //We just need to give them a token
  res.send({token: tokenForUser(req.user)});

};

exports.signup = function(req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({error: 'you must provide email and password'});
  }

  //See if a user with the given email exists

  User.findOne({email: email}, function(err, existingUser) {
    // if the connection to DB does not exist
    if (err) { return next(err);}


    //if a user with email exist, return an error
    if (existingUser) {
      return res.status(422).send({error: 'Email is in use'}); //error means could not process
    }

    //if a user with email does not exist, then create and save user record
    const user = new User({
      email: email,
      password: password
    });
    user.save(function(err) {
      if (err) {return next(err);}
      //Respond to request indicating that the user was created
      res.json({token: tokenForUser(user)});
    });
  });

  
};