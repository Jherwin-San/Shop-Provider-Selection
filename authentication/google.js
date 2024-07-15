const passport = require('passport');
require("../passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require('express');
// const googleAuth = require('../controllers/googleAuthController');
const { registerAndLoginWithGoogle } = require("../controllers/user");
const { createAccessToken } = require("../authentication/auth");
const jwt = require("jsonwebtoken");
const secret = "OnlineShopAPI";
const router = express.Router();
require('dotenv').config();
// let userProfile;
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_SECRET_KEY,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     function (accessToken, refreshToken, profile, done) {
//       userProfile = profile;
//       return done(null, userProfile);
//     }
//   )
// );

// request at /auth/google, when user click sign-up with google button transferring
// the request to google server, to show emails screen
router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
// router.get(
//   '/callback', passport.authenticate('google', { 
//     session: false,  
//     successRedirect: process.env.CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
//   // , (req, res) => {
//   //   passport.authenticate("google", {
     
//   //   });
//   // }
// );

// URL Must be same as 'Authorized redirect URIs' field of OAuth client, i.e: /auth/google/callback
router.get(
  '/callback', passport.authenticate('google', { 
    session: false, 
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  }), (req, res) => {

  // Generate a token and send it to the client
  // const token = jwt.sign({ userId: req.user._id, email: req.user.email }, secret, { expiresIn: '1h' });
  // // res.redirect(`http://localhost:5173`, { token }); // Successful authentication, redirect success.
  // res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

// router.get('/success', async (req, res) => {
//   const { failure, success } = await registerAndLoginWithGoogle(userProfile);
//   if (failure) console.log('Google user already exist in DB..');
//   res.render('success', { user: userProfile });
// });

// router.get('/error', (req, res) => res.send('Error logging in via Google..'));

// router.get('/signout', (req, res) => {
//   try {
//     req.session.destroy(function (err) {
//       console.log('session destroyed.');
//     });
//     res.render('auth');
//   } catch (err) {
//     res.status(400).send({ message: 'Failed to sign out user' });
//   }
// });
// Refresh token endpoint
router.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  // Verify the refresh token
  jwt.verify(refreshToken, "refresh", (err, user) => {
    if (err) return res.sendStatus(403);

    // Generate a new access token
    const accessToken = createAccessToken({ id: user.id, isAdmin: user.isAdmin });
    res.json({ accessToken });
  });
});

router.get("/login/success", async(req, res) => {
  const { failure, success } = await registerAndLoginWithGoogle(req.user);
    if (failure) {
      res.status(403).json({ error: true, message: "Not Authorized" });
      console.log(success);
    }
	 else {
    console.log(success);
    res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
      access: success,
		});
	}
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

// router.get("/google", passport.authenticate("google", ["profile", "email"]));

// router.get(
// 	"/auth/google/callback",
// 	passport.authenticate("google", {
// 		successRedirect: process.env.CLIENT_URL,
// 		failureRedirect: "/login/failed",
// 	})
// );

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
