// [SECTION] Dependencies and Modules
const express = require("express");
const productController = require("../controllers/product.js");
const auth = require("../authentication/auth.js");
const { verify, verifyAdmin } = auth;

// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Routes

router.post("/upload", productController.createProductImage);

// POST /products - Create a new product
router.post("/",  productController.createProduct);

// GET /products/all - Get all products
router.get("/all", productController.getAllProducts);

// GET /products/active - Get all active products
router.get("/active", productController.getAllActive);

// GET /products/popular - Get all popular products
router.get("/popular", productController.getAllPopular);

// GET /products/new - Get all new products
router.get("/new", productController.getAllNew);

// GET /products/:productId - Get a product by ID
router.get("/:productId", productController.getProduct);

router.delete("/delete/:productId", productController.deleteProduct);

// PUT /products/:productId - Update a product by ID
router.put("/:productId", verify, verifyAdmin, productController.updateProduct);

// PATCH /products/archive/:productId - Archive a product by ID
router.patch("/archive/:productId", verify, verifyAdmin, productController.archivedProduct);

// PATCH /products/setpopular/:productId - Update a product status by ID
router.patch("/setpopular/:productId", verify, verifyAdmin, productController.setPopularProduct);

// PATCH /products/setnew/:productId - Update a product status by ID
router.patch("/setnew/:productId", verify, verifyAdmin, productController.setNewProduct);

// PATCH /products/activate/:productId - Activate a product by ID
router.patch("/activate/:productId", verify, verifyAdmin, productController.activateProduct);

// POST /products/searchByName - Search products by name
router.post("/searchByName", productController.searchByName);

// POST /products/searchByPrice - Search products by price range
router.post("/searchByPrice", productController.searchByPrice);

module.exports = router;
