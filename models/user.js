'use strict';

const mongoose = require('mongoose');
//This schema tell mongoose about particular fields that model have
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// DEFINE OUR MODEL
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true },
  password: String
});

// On save hook, encrypt password
//Before saving model, run this function
userSchema.pre('save', function(next) {
  //Get access to the user model
  const user = this;

  //generate a salt, then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {return next(err);}

    //hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }
      
      //overwrite plain text password with encrypted password
      user.password = hash;
      //next means go ahead and save the model
      next();
    });
  });
});

//methods mean whenever we ceate a user object, it is gonna have acces to 
//any function that we define on the method property
//So we define a new function called comparePassword, any use object can access this function
//This.password is the hashed password stored in the DB, candidatepassword is
//the one submitted by the user
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

// CREATE THE MODEL CLASS (feed schema into mongoose)
//It coresspond to the collection "user"
//This modelclass represent all users
const User = mongoose.model('user', userSchema);


//EXPORT THE MODEL so other files can make use of it
module.exports = User;

///NOTE: use this command to take ownership of the database directory
//sudo chown -R $USER /data/d