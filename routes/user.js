const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Use 'User' as the model name (recommended)
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.randerSignupForm)
.post( wrapAsync (userController.signup));

router.route("/login")
.get(userController.renderloginForm)
.post( saveRedirectUrl , passport.authenticate("local", {failureRedirect:"/login", failureFlash: true}), userController.login);

// // GET signup form
// router.get("/signup", userController.randerSignupForm);

// // POST signup form
// router.post("/signup", wrapAsync (userController.signup));

// // GET login form
// router.get("/login",userController.renderloginForm);

// // POST login form
// router.post("/login", saveRedirectUrl , passport.authenticate("local", {failureRedirect:"/login", failureFlash: true}), userController.login);

// GET logout form
router.get("/logout", userController.logout);

module.exports = router;
