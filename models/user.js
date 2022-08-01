// Import modules
const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4 } = require("uuid");

// Schema from mongoose
let { Schema } = mongoose;

// Defining the user schema
let userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },

    lastName: {
      type: String,
      maxLength: 32,
      trim: true,
    },
    // note: Password here
    storedEncryptedPassword: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    userInfo: {
      type: String,
      trim: true,
    },

    salt: String,

    role: {
      type: Number,
      default: 0,
    },

    purchases: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

//NOTE: Here is the Virtual Password property of userSchema
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = v4();
    this.storedEncryptedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  //Method to check whether the password is correct or not
  authenticate: function (plainPassword) {
    return this.encryptPassword(plainPassword) === this.storedEncryptedPassword;
  },

  //Method to hash password
  encryptPassword: function (plainPassword) {
    if (!plainPassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

// const User = mongoose.model("User", userSchema);
//
// const Me = new User({
//   name: "Ritesh",
//   lastName:"Gupta"
// });
//
// console.log(Me.name)

module.exports = mongoose.model("User", userSchema);
