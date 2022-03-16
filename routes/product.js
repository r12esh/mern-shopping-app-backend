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

//params:-
router.param("userId", getUserById);
router.param("productId", getProductById);

//Actual useful routes:-
//POST routes :-
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);

//GET routes:-
router.get("/product/:productId", getProduct);
router.get("product/photo/productId", photo);

//LISTING routes:-
router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCategories);

//UPDATE routes:-
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//DELETE routes:-
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);


module.exports = router;