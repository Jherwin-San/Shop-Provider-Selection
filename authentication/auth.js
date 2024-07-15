const jwt = require("jsonwebtoken");
const secret = "OnlineShopAPI";
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(data, secret, { expiresIn: '2h'});
};

module.exports.verify = (req, res, next) => {
  // console.log(req.headers.authorization);

  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.send({
      auth: "Failed. No token",
      message: "Please provide the token by logging into your account.",
    });
  } else {
    // console.log(token);
    token = token.slice(7, token.length);
    // console.log(token);
    jwt.verify(token, secret, function (err, decodedToken) {
      if (err) {
        return res.send({
          auth: "Failed",
          message: err.message,
        });
      } else {
        console.log("result from verify method: ");
        console.log(decodedToken);

        req.user = decodedToken;

        next();
      }
    });
  }
};

module.exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden. For Admin Access ONLY",
    });
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};


// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_SECRET_KEY,
//   callbackURL: "/auth/google/callback"
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ googleId: profile.id });

//     if (!user) {
//       user = new User({
//         googleId: profile.id,
//         email: profile.emails[0].value,
//         profile: profile.photos[0].value,
//         firstName: profile.name.givenName,
//         lastName: profile.name.familyName,
//         provider:"Google"
//       });
//       await user.save();
//     }

//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// }));

// passport.use(new GitHubStrategy({
//   clientID: process.env.GITHUB_CLIENT_ID,
//   clientSecret: process.env.GITHUB_SECRET_KEY,
//   callbackURL: "/auth/github/callback"
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ githubId: profile.id });

//     if (!user) {
//       user = new User({
//         githubId: profile.id,
//         email: profile.emails[0].value,
//         profile: profile.photos[0].value,
//         firstName: profile.username,
//         lastName: "",
//         provider:"Github"
//       });
//       await user.save();
//     }

//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });