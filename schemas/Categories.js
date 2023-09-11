const mongoose = require("mongoose");

const categoryModel = function () {
  const categorySchema = new mongoose.Schema(
    {
      id: { type: Number, require: true, unique: true, index: true },
      title: { type: String, require: true, trim: true },
      name: { type: String, require: true, trim: true },
      sort: { type: Number, require: true, trim: true },
    },
    {
      versionKey: false,
    }
  );

  return mongoose.model("Categories", categorySchema);
};

module.exports = new categoryModel();
