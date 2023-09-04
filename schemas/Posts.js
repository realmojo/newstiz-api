const mongoose = require("mongoose");
const autoIdSetter = require("./auto-id-setter.js");

const postSchema = new mongoose.Schema(
  {
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

autoIdSetter(postSchema, mongoose, "id");

// const PostModel = mongoose.model("Posts", postSchema);

module.exports = postSchema;
