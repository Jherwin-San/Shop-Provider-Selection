// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user.js");
const auth = require("../authentication/auth.js");
const { verify, verifyAdmin, isLoggedIn } = auth;
const passport = require('passport');

// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Routes

router.post("/profile", userController.createUserImage);

// POST /users - Register a new user
router.post("/", userController.registerUser);

// POST /users/login - User login
router.post("/login", userController.loginUser);

// get /users/details - Get user profile details
router.get("/details", verify, userController.getProfile);

// PUT /users/set-as-admin - Set user as admin
router.put("/set-as-admin", verify, verifyAdmin, userController.updateUserAccess);

// PUT /users/update-password - Update user password
router.put("/update-password", verify, userController.updatePassword);

// PUT /users/update-user - Update user details
router.put("/update-user", verify, userController.updateUserDetails);

// PUT /users/update-user - Update user details
router.put("/update-profile", verify, userController.updateUserProfile);

// PUT /users/update-user - Update user details
router.put("/update-email", verify, userController.updateUserEmail);

// PUT /users/update-user - Update user details
router.put("/update-mobile", verify, userController.updateUserMobileNo);

// DELETE /users/:userId/archived - Delete user
router.delete("/archived/:userId", verify, verifyAdmin, userController.deleteUser);

// GET /users/all - Get all users
router.get("/all", verify, verifyAdmin, userController.getAllUsers);

// //[SECTION] Google Login
// //[SECTION] Route for initiating the Google OAuth consent screen
// router.get("/google", 
// 	// Uses the "authenticate" method of passport to verify the email credentials in Google's APIs
// 	passport.authenticate("google", {
// 		// Scopes that are allowed when retrieving user data
// 		scope: ["email", "profile"],
// 		// Allows the OAuth consent screen to be "prompted" when the route is accessed to select a new account every time the user tries to login.
// 		// Comment this out and access this route twice to see the difference
// 		// If removed, automatically redirects the user to "/google/success" route
// 		// If added, always returns the OAuth consent screen to allow the user to choose an account
// 		prompt: "select_account"

// 	}
// ));

// //[SECTION] Route for callback URL for Google OAuth authentication
// router.get("/google/callback",
// 	// If authentication is unsuccessful, redirect to "/users/failed" route
// 	passport.authenticate("google", {
// 		failureRedirect: "/users/failed"	
// 	}),
// 	// If authentication is successful, redirect to "/users/success" route
// 	function(req, res){
// 		res.redirect("/users/success");
// 	}
// );

// //[SECTION] Route for failed Google OAuth authentication
// router.get("/failed", (req,res) => {

// 	console.log("User is not authenticated");
// 	res.send("Failed");

// });

// //[SECTION] Route for successful Google OAuth authentication
// router.get("/success", isLoggedIn, (req,res) => {

// 	console.log("You are logged in");
// 	console.log(req.user);
// 	res.send(`Welcome ${req.user.displayName}`);

// });


// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {

// });

// router.post('/register/google', async (req, res) => {
//     const oauthUser = req.body; // This should be populated with the Google OAuth response
//     const result = await googleAuthController.registerWithGoogle(oauthUser);
  
//     if (result.failure) {
//       return res.status(400).send(result.failure);
//     }
//   console.log(oauthUser);
//     return res.status(201).send(result.success);
//   });

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

module.exports = router;
