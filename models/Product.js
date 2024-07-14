const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  image: {
    type: String,
    required: [true, "Image file is Required"],
  },
  otherName:{
    type: String,
    required: [true, "Name is Required"],
  },
  category: {
    type: String,
    required: [true, "Category is Required"],
  },
  description: {
    type: [String],
    required: [true, "Description is Required"],
  },
  price: {
    type: Number,
    required: [true, "Price is Required"],
  },
  inventoryStock: {
    type: Number,
    required: [true, "Inventory stock is Required"],
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  isNew: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
