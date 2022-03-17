const Category = require("../models/category");

const getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    req.category = cate;
    next();
  });
};

const getCategory = (req, res) => {
  return res.json(req.category);
};

const createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, newCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save category in DB",
      });
    }
    return res.json({ newCategory });
  });
};

const getAllCategories = (req, res) => {
  Category.find().exec((err, allCategories) => {
    if (err || !allCategories) {
      return res.status(400).json({
        error: "No categories found",
      });
    }
    return res.status(200).json(allCategories);
  });
};

const updateCategory = (req, res) => {
  //This is a database element because in our middleware above (getCategoryById) req.category was set from database
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update category",
      });
    }
    return res.json(updatedCategory);
  });
};

const deleteCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the category",
      });
    }
    return res.json({
      message: `Succesfully deleted category ${category.name}`,
    });
  });
};

module.exports = {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
