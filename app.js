require("dotenv").config(); //this way of importing is very old but used only for this module.
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

//My routes:-
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

//DB Connection:-
mongoose
  .connect("mongodb://localhost:27017/tShirt")
  .then(() => {
    console.log("DB CONNECT HO GAYA");
  })
  .catch(() => {
    console.log("AREEE NAHI HUA CONNECT");
  });

//Middlewares:-
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors());
// app.use(cors({'Access-Control-Allow-Origin':"http://localhost:3000"}));
app.use(
  cors({
    origin: "http://localhost:3000",
    // credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//Using routes:-
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

//Server starts:-
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`APP ${port} PORT PE RUN KAR RHA HAI`);
});
