// Dependencies and Modules
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Provider Login
const passport = require("passport");
const session = require("express-session");
require("./passport");

//Cross Origin
const cors = require("cors");

// Allows access to routes defined within our application
const authRouter = require("./authentication/google.js");
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const ratingRoutes = require("./routes/rating.js")

// [SECTION] Environment Setup

// [SECTION] Server Setup
// Creates an "app" variable that stores the result of the "express" function that initializes our express application and allows us access to different methods that will make backend creation easy
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// Google Login
app.use(
  session({
    secret: "SocialProviders",
    resave: false,
    saveUninitialized: false,
  })
);

// Initializes the passport package when the application runs
app.use(passport.initialize());
// Creates a session using the passport package
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: "GET,POST,PUT,PATCH,DELETE",
		credentials: true,
	})
);

// Connect to MongoDB database
mongoose.connect(
  `${process.env.MONGO_URI}`
);

// Prompts a message in the terminal once the connection is "open" and we are able to successfully connect to our database
mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);

// passport.serializeUser(function (user, cb) {
//   cb(null, user);
// });
// passport.deserializeUser(function (obj, cb) {
//   cb(null, obj);
// });

// Backend Routes
// app.use("/", (req,res) => {
//   // return res.json({
//   //   message:"Welcome to Jher's Node.js REST API using ExpressJS and MongoDB"
//   // })
// } )


app.use('/auth/google', authRouter);
// app.use('/auth/facebook', facebookRouter);
// app.use('/auth/github', githubRouter);

app.use("/shop/users", userRoutes);
app.use("/shop/products", productRoutes);
app.use("/shop/carts", cartRoutes);
app.use("/shop/orders", orderRoutes);
app.use("/shop/ratings", ratingRoutes);

if (require.main === module) {
  app.listen(port, () => console.log(`Server running at ${port}`));
}
module.exports = { app, mongoose };
   