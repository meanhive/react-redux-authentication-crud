const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
      sparse: true,
    },
    mobile: { type: Number, required: true },
    address: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true, select: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "users",
  }
);
UserSchema.plugin(uniqueValidator, { message: " is already taken" });

module.exports = mongoose.model("User", UserSchema);
