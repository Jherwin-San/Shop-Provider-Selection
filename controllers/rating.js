const Rating = require("../models/Rating.js");
const User = require("../models/User.js");

// Controller function to create a new rating
module.exports.createRating = async (req, res) => {
    const {  productId, ratingValue, comments } = req.body;
  
    try {
        const userId = req.user.id
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        const { firstName, lastName, profile} = user;
        // Create a new rating
        const newRating = new Rating({
            userId: userId,
            userName: firstName + " " + lastName,
            profile:profile,
            productId: productId,
            ratingValue: ratingValue,
            comments: comments
        });

        // Save the new rating
        await newRating.save();

        res.status(201).json({
            status: 'success',
            message: 'The rating was created successfully',
            data: {
                rating: newRating
            }
        });
    } catch (err) {
        console.error("Error in saving: ", err);
        res.status(500).json({
            status: 'error',
            message: 'Error in saving the rating'
        });
    }
};


// Controller function to get all ratings
module.exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({}).then(rates => {
        if (rates.length > 0) {
            // If products are found, return them with a success status code
            return res.status(200).json({ rates });
          } else {
            // If no products are found, return a message with a success status code
            return res.status(200).json({ message: "No rating found at the moment." });
          }
    } ) ;
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Controller function to get a single rating by ID
module.exports.getRatingByProductId = async (req, res) => {
    try {
      const ratings = await Rating.find({ productId: req.params.productId });
      if (!ratings || ratings.length === 0) {
        res.status(404).json({
          status: 'fail',
          message: 'Ratings not found for the provided product ID'
        });
      } else {
        res.status(200).json({
          status: 'success',
          data: {
            ratings
          }
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message
      });
    }
  };
  

// Controller function to update a rating by ID
module.exports.updateRating = async (req, res) => {
  try {
    const productId = req.params.ratingId;
    const { ratingValue, comments } = req.body;

    // Check if ratingValue or comments are provided
    if (!ratingValue && !comments) {
      return res.status(400).json({ message: "No ratingValue or comments provided." });
    }

    const updatedRating = {};
    if (ratingValue !== undefined) { // Check if ratingValue is provided and not null or undefined
      updatedRating.ratingValue = ratingValue;
    }
    if (comments !== undefined) { // Check if comments is provided and not null or undefined
      updatedRating.comments = comments;
    }

    // Check if productId is provided
    if (!productId) {
      return res.status(400).json({ message: "No productId provided." });
    }

    const rating = await Rating.findByIdAndUpdate(productId, updatedRating, {
      new: true,
      runValidators: true
    });

    if (rating) {
      return res.status(200).json({
        message: "The product rating is updated successfully",
        updatedRating: rating,
      });
    } else {
      return res.status(404).json({ message: "Product rating not found." });
    }
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};


// Controller function to delete a rating by ID
exports.deleteRating = async (req, res) => {
  try {
    const deleteRate = await Rating.findByIdAndDelete(req.params.id);
   if (deleteRate){
    return res.status(204).json({
      status: 'success',
      data: "deleted"
    });
   } else {
    return res.status(404).json({ message: "The rating does not exist." });
   }
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Rating not found'
    });
  }
};
