const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");


const getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category") //Populating based on category
    .exec((err, product) => {
      if (err) {
        return res.status.json({
          error: "Product not found"
        });
      }
      req.product = product;
      next();
    });
}

const createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image"
      });
    }
    //Destructuring the fields:-
    const {name, description, price, category, stock} = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "PLease include all fields"
      });
    }

    let product = new Product(fields);

    //Handle file here:-
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Save to the DB:-
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving Tshirt in DB failed"
        });
      }
      return res.json(product);
    });
  });
}

const getProduct = (req, res) => {
  res.product.photo = undefined;
  return res.json(res.product);
}

//Middleware
const photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType)
    return res.send(req.product.photo.data);
  }
  next();
}

//Delete controller
const deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product"
      });
    }
    return res.json({
      message: "Deletion was a success",
      deletedProduct
    });
  });
}

//Update controller
const updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image"
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    //Handle file here:-
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Save to the DB:-
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updating Tshirt in DB failed"
        });
      }
      return res.json(product);
    });
  });
}

//Product listing
const getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product
    .find()
    .select("-photo")//This '-' means not selecting photos
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, allProducts) => {
      if (err) {
        return res.status(400).json({
          error: "No products found"
        });
      }
      return res.json(allProducts);
    });
}

const updateStock = (req, res, next) => {

  let myOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: {_id: prod._id},
        update: {$inc: {stock: -prod.count, sold: +prod.count}}
      }
    }
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed"
      });
    }
    next();
  });
}

const getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No categtory found"
      });
    }
    return res.json(category);
  });
}

//Exporting functions:-
module.exports = {
  getProductById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  updateStock,
  getAllUniqueCategories
}