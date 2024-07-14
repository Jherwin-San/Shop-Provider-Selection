// [SECTION] Dependencies and Modules
const bcrypt = require("bcrypt");
// The "User" variable is defined using a capitalized letter to indicate that what we are using is the "User" model for code readability
const User = require("../models/User.js");
const auth = require("../authentication/auth.js");
const nodemailer = require('nodemailer');
const emailService = require('../services/emailService');
const cloudinary = require("../services/cloudinary.js");
const upload = require("../services/multer.js");

//[SECTION] Uaer Image Destination
module.exports.createUserImage = (req, res) => {
  upload.single('user-image')(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error"
      });
    }
    
    cloudinary.uploader.upload(req.file.path, {folder: "profiles",}, function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error"
        });
      }

      res.status(200).json({
        success: true,
        message: "Uploaded!",
        data: result.secure_url
      });
    });
  });
};


//[SECTION] User registration
module.exports.registerUser = async (req, res) => {
  let { profile, firstName, lastName, email, password, mobileNo } = req.body;

  try {
    const initial = firstName ? firstName[0] : 'User';
    // Set default profile if null
    if (!profile) {
       profile = `https://placehold.co/600x400?text=${initial}`;
    }
    // Validate user input
    if (!email.includes("@")) {
      return res.status(400).send({ error: "Invalid email format" });
    }

    if (mobileNo.length !== 11) {
      return res.status(400).send({ error: "Invalid mobile number" });
    }

// Validate password format
    if (!/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,]).{8,}/.test(password)) {
      return res.status(400).send({ error: "Password must contain at least one number, one letter, and one special character, and be at least 8 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "User already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      profile,
      firstName,
      lastName,
      email,
      mobileNo,
      password: hashedPassword,
    });

    // Save the user to the database
    const user = await newUser.save();

    // Send a welcome email to the user
    await emailService.sendWelcomeEmail(email);

    // Respond with success message and user details
    return res.status(201).send({ message: "Registered successfully", user });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//[SECTION] User authentication / Login 
module.exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  try {
    if (email.includes("@")) {
      return User.findOne({ email: email })
        .then((result) => {
          if (result == null) {
            return res.status(404).send({ error: "No Email Found" });
          } else {
            const isPasswordCorrect = bcrypt.compareSync(
              password,
              result.password
            );

            if (isPasswordCorrect) {
              return res
                .status(200)
                .send({ access: auth.createAccessToken(result) });
            } else {
              // return res.send("Email and password do not match");
              return res
                .status(401)
                .send({ message: "Email and password do not match" });
            }
          }
        })
        .catch((err) => {
          console.error("Error in find: ", err);
          return res.status(500).send({ error: "Error in find" });
        });
    } else {
      return res.status(400).send({ error: "Invalid Email" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//[SECTION] Retrieve user Details
module.exports.getProfile = (req, res) => {
  const userId = req.user.id;

  try {
    return User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }

        // Exclude sensitive information like password
        user.password = undefined;

        return res.status(200).send({ user });
      })
      .catch((err) => {
        console.error("Error in fetching user profile", err);
        return res.status(500).send({ error: "Failed to fetch user profile" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [SECTION] Update the password
module.exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id, email } = req.user; // Extracting user ID and email from the authorization header

    // Validate user input
    if (newPassword.length < 8 || !/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,]).{8,}/.test(newPassword)) {
      return res.status(400).json({ error: "Password must contain at least one number, one letter, one special character, and be at least 8 characters long" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const update = await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Send email notification
    await emailService.sendPasswordUpdateEmail(email);

    // Sending a success response
    return res.status(200).json({ message: "Password updated successfully", update });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// [SECTION] Update the user details
module.exports.updateUserDetails = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const { id , email} = req.user; // Extracting user ID and email from the authorization header
    // Update the user's password in the database
    const update = await User.findByIdAndUpdate(id, { firstName: firstName, lastName: lastName});

    // Send email notification
    await emailService.sendUpdatedAccountInfo(email);

    // Sending a success response
    return res.status(200).json({ message: "User details updated successfully", update });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// [SECTION] Update the  email
module.exports.updateUserEmail = async (req, res) => {
  try {
    const {email} = req.body;
    const { id } = req.user; // Extracting user ID and email from the authorization header

    // Update the user's password in the database
    const update = await User.findByIdAndUpdate(id, {  email: email });

    // Send email notification
    await emailService.sendUpdatedAccountInfo(email);

    // Sending a success response
  
    return res.status(200).json({ message: "Email updated successfully", update });
  } catch (error) {
    console.error("Error updating email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// [SECTION] Update the user
module.exports.updateUserProfile = async (req, res) => {
  try {
    const {profile} = req.body;
    const { id, email } = req.user; // Extracting user ID and email from the authorization header

    // Update the user's password in the database
    const update = await User.findByIdAndUpdate(id, {  profile: profile });

    // Send email notification
    // await emailService.sendUpdatedAccountInfo(email);
    // console.log(id, email);
    // Sending a success response
    return res.status(200).json({ message: "Profile updated successfully", update });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// [SECTION] Update the user
module.exports.updateUserMobileNo= async (req, res) => {
  try {
    const { mobileNo } = req.body;
    const { id } = req.user; // Extracting user ID and email from the authorization header

    // Update the user's password in the database
    const update = await User.findByIdAndUpdate(id, {  mobileNo: mobileNo });

    // Sending a success response
    return res.status(200).json({ message: "Mobile number updated successfully", update });
  } catch (error) {
    console.error("Error updating mobile number :", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// [SECTION] Update user to Admin
module.exports.updateUserAccess = async (req, res) => {
  const { userId } = req.body;

  try {
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
      return res.status(403).send("Access denied. Only admin users can perform this action.");
    }

    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      return res.status(404).send("User not found");
    }

    // Check if the user is already an admin
    if (userToUpdate.isAdmin == true ) {
      // userToUpdate.isAdmin = false;

      // updated = await userToUpdate.save();

      const updatedAccess = await User.findByIdAndUpdate(
        userId,
        { isAdmin: false },
        { new: true }
      );
      const updated = await updatedAccess.save();
      return res.status(200).send({ message:"User is already an admin - reverted to user", updated: updated});
    }
    const updatedAccess = await User.findByIdAndUpdate(
      userId,
      { isAdmin: true },
      { new: true }
    );
    const updated = await updatedAccess.save();
    return res.status(200).send({ message:"User updated as admin successfully",
    updated: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};


// [SECTION] Delete a user
module.exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Use findById to check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    } else {
      const deletedItem = await User.findByIdAndDelete(userId);

      if (deletedItem) {
        return res.send("The User account has been successfully deleted");
      } else {
        return res.send("User not found");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

// [SECTION] Get all users
module.exports.getAllUsers = (req, res) => {
  try {
    return User.find({})
      .then((users) => {
        if (users.length > 0) {
          return res.status(200).send({ users });
        } else {
          return res.status(200).send({ message: "No users found." });
        }
      })
      .catch((err) => {
        console.error("Error in finding all users", err);

        return res.status(500).send({ error: "Error finding users" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
