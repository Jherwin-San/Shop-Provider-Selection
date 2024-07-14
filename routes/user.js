// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user.js");
const auth = require("../authentication/auth.js");
const { verify, verifyAdmin } = auth;

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

module.exports = router;
