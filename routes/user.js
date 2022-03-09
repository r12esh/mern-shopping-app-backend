const express = require("express");
const router = express.Router();

const {getUserById, getUser, getAllUsers, updateUser, userPurchaseList} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

//router.param :-
router.param("userId", getUserById);

//router.get:-
// Get the Signed in User info (Requires the Authorization Token which we get after succesful signin)
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.get("/users", getAllUsers);
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

//router.put:-
//Update the user's info
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

module.exports = router;