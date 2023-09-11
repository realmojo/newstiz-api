const Category = require("../../schemas/Categories");

const getCateogories = async (req, res) => {
  try {
    const result = await Category.find({}, "title name").sort({ sort: 1 });
    return res.status(200).send({ status: "ok", items: result });
    // return [];
  } catch (e) {
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  getCateogories,
};
