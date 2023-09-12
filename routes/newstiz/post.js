const Post = require("../../schemas/Posts");

const getPost = async (req, res) => {
  try {
    const { _id } = req.params;
    const data = await Post.findOne({ _id });
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getPostList = async (req, res) => {
  try {
    const { category } = req.query;

    let data = [];
    if (category) {
      data = await Post.find({ category }).sort({ sort: 1 });
    } else {
      data = await Post.find({}).sort({ sort: 1 });
    }
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  getPost,
  getPostList,
};
