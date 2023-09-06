const mongoose = require("mongoose");

const counterModel = function () {
  const counterSchema = new mongoose.Schema(
    {
      _id: { type: String, default: "postId" },
      seq: { type: Number, default: 0 },
    },
    {
      versionKey: false,
    }
  );

  return mongoose.model("Counter", counterSchema);
};

module.exports = new counterModel();
