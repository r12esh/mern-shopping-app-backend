const express = require("express");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check } = require("express-validator");
const router = express.Router();

//POST request for signup:-
router.post(
  "/signup",
  [
    check("name", "Name should be atleast 6 characters long").isLength({
      min: 6,
    }),
    check("email", "Please input a correct email").isEmail(),
    check(
      "password",
      "Password should be aleast 6 random characters long"
    ).isLength({ min: 6 }),
  ],
  signup
);

//POST request for signin:-
router.post(
  "/signin",
  [
    check("email", "Please input a correct email").isEmail(),
    check("password", "PLease input correct passwod > 6 chars").isLength({
      min: 6,
    }),
  ],
  signin
);

//GET request for signout:-
router.get("/signout", signout);

//GET request for ckecking for our testroute:-
router.get("/testroute", isSignedIn, (req, res) => {
  // res.send("A protected route");
  res.json(req.auth);
});

module.exports = router;
