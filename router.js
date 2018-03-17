'use strict';
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

//session: false means who do not want passport to create a cookie based session for this request
// now the requireAuth is the middleware interception between incoming request and route handler
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

//To export code in the Nodejs environment, we use module.export
//This is how we make route handlers inside the express app
module.exports = function(app) {
  //any request coming in have to first going through the requireAuth before
  // going to the function route handler
  app.get('/', requireAuth, function(req, res) {
    res.send({hi: 'there'});
  });
  //Requiresignin check for corect email and password, if not
  //it cannot access route handler
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);


};