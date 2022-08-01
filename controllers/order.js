const { Order, ProductCart } = require("../models/order");

const getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Order not found",
        });
      }
      req.order = order;
      next();
    });
};

const createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save the order in DB",
      });
    }
    return res.json(order);
  });
};

const getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found in DB",
        });
      }
      res.json({ order });
    });
};

const getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

const updateStatus = (req, res) => {
  Order.updateOne(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Cannot update the status",
        });
      }
      return res.json(order);
    }
  );
};

//Exports:-
module.exports = {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus,
};
