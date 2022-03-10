const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories
} = require("../controllers/product");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");
const {getAllCategories} = require("../controllers/category");

const a = 9;

//params:-
router.param("userId", getUserById);
router.param("productId", getProductById);

//Actual useful routes:-
//POST routes :-
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);

//GET routes:-
router.get("/product/:productId", getProduct);
router.get("product/photo/productId", photo);

//UPDATE routes:-
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//DELETE routes:-
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);

//LISTING routes:-
router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;