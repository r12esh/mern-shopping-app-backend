//Models import:-
const User = require("../models/user");
const {validationResult, body} = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//Response to client for signup POST request:-
const signup = (req, res) => {
  //Validating the data and sending the error to client (if any).
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    })
  }
  //If no error in validating save the data to database.
  const newUser = new User(req.body);
  newUser.save((error, user) => {
    if (error) {
      return res.status(400).json({
        error: "Not able to store data in DB"
      });
    }
    //Sending the confirmational response to the client for succesful signup.
    return res.json({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      id: user._id,
      storedEncryptedPassword: user.storedEncryptedPassword,
    });
  });
};

//Response to client for signin POST request:-
const signin = (req, res) => {
  const {email, password} = req.body;
  //validating the data and sending the error to client (if any).
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    })
  }
  //searching for the email in the database.
  User.findOne({email}, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "User email does not exist"
      });
    }
    //if password is wrong send the error
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Password incorrect"
      });
    }
    //make a token if no error and Send the user id to frontend.
    const token = jwt.sign({_id: user._id,}, process.env.SECRET);
    //puting the token in the cookie.
    res.cookie("token", token, {expire: 9999 + new Date()});
    //send response to frontend
    const {_id, name, lastName, email, role} = user;
    return res.json({
      token,
      user: {_id, name, lastName, email, role}
    });
  });
};

//Response to client for signout GET request:-
const signout = (req, res) => {
  res.clearCookie("token");
  return res.json({
    message: "User signout succesfully"
  })
};

//Protected routes:-
const isSignedIn = expressJwt({
  algorithms: ['HS256'],
  secret: process.env.SECRET,
  userProperty: "auth" // Use req.auth in route/auth.js
});

//Custom middlewares:-
const isAuthenticated = (req, res, next) => {
  //Checking whether user is authenticated or not by comparing inputed profile
  //req.profile is setup by frontend and req.auth is by our middleware above (isSignedIn)
  let checker = req.profile && req.auth && (req.profile._id == req.auth._id);// we need == not ===
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED"
    });
  }
  next();
}

const isAdmin = (req, res, next) => {
  //In our user model schema, we have set that if role is 0 then they are not admin!
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not an ADMIN, ACCESS DENIED!"
    });
  }
  next();
}

//Exporting all the controllers:-
module.exports = {
  signup,
  signin,
  signout,
  isAdmin,
  isAuthenticated,
  isSignedIn
};


