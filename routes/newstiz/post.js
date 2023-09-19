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
    const limit = 24;
    let { category, page } = req.query;
    if (!Number(page)) {
      page = 1;
    }
    page = Number(page);

    let data = [];
    if (category) {
      data = await Post.find({ category })
        .skip(limit * (page - 1))
        .limit(limit)
        .sort({ _id: -1 });
    } else {
      data = await Post.find({})
        .skip(limit * (page - 1))
        .limit(limit)
        .sort({ _id: -1 });
    }

    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({ status: "err", message: e.message });
  }
};

const getPostSitemapList = async (req, res) => {
  try {
    const { startDate } = req.query;

    if (!startDate) {
      throw new Error("startDate parameter");
    }
    const regex = (pattern) => new RegExp(`.*${pattern}.*`);
    const regdateRegex = regex(startDate); // .*토끼.*

    const data = await Post.find({ regdate: { $regex: regdateRegex } });
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  getPost,
  getPostList,
  getPostSitemapList,
};
