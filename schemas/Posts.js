const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-auto-increment");
// AutoIncrement.initialize(mongoose.connection);

const postModel = function () {
  const postSchema = new mongoose.Schema(
    {
      _id: { type: Number, default: 0 },
      category: { type: String, require: true, trim: true },
      logo: { type: String, require: true, trim: true },
      title: { type: String, require: true, trim: true },
      subTitle: { type: [String], trim: true },
      content: { type: [String], require: true, trim: true },
      tags: { type: [String], require: true, trim: true },
      editor: { type: String, require: true, trim: true },
      email: { type: String, require: true, trim: true },
      regdate: { type: String, require: true, trim: true },
    },
    {
      versionKey: false,
    }
  );

  // postSchema.plugin(AutoIncrement.plugin, "Post");
  return mongoose.model("Post", postSchema);
};

module.exports = new postModel();
