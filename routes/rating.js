// [SECTION] Dependencies and Modules
const express = require("express");
const ratingController = require("../controllers/rating.js");
const auth = require("../authentication/auth.js");
const { verify } = auth;

// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Routes


// Route to create a new rating
router.post('/create', verify, ratingController.createRating);

// Route to get all ratings
router.get('/', ratingController.getAllRatings);

// Route to get a single rating by ID
router.get('/:productId', ratingController.getRatingByProductId);

// Route to update a rating by ID
router.put('/update/:ratingId', verify, ratingController.updateRating);

// Route to delete a rating by ID
router.delete('/removed/:id', verify, ratingController.deleteRating);

module.exports = router;
