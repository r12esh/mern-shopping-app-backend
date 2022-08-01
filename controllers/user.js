const User = require("../models/user");
const Order = require("../models/order");

const getUserById = (req, res, next, id) => {
  //Whenever there is a databse callback we get either error or our user (data)
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

const getUser = (req, res) => {
  req.profile.storedEncryptedPassword = undefined;
  req.profile.salt = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

//Assignment:-
const getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "No users found",
      });
    }
    return res.status(200).json(users);
  });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false }, //useFindAndModify is false so that findOneAndUpdate can use it's native apis otherwise findOneAndUpdate and findOneAndDelete will not work the same
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user",
        });
      }
      user.storedEncryptedPassword = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );
};

const userPurchaseList = (res, req) => {
  Order.find({ user: req.profile._id })
    //Anytime we reference something from a different collection we use populate.
    //This takes two parameters 1. Which model or object you want to update and 2. what fields we bring in.
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order in this account",
        });
      }
      return res.json(order);
    });
};

//Custom middlewares:-
const pushOrderInPurchaseList = (res, req, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //Store this in the DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true }, //This means the object returning from the database is the new updated one and not the old one
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};

module.exports = {
  getUser,
  getUserById,
  getAllUsers,
  updateUser,
  userPurchaseList,
  pushOrderInPurchaseList,
};
