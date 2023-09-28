const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  { 
    googleId: { type: String },
    email: { type: String },
    image: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    displayName: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", UserSchema);
