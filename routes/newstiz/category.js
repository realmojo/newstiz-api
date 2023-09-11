const Category = require("../../schemas/Categories");

const getCateogories = async (req, res) => {
  try {
    console.log("get Category");
    const result = await Category.find({}, "title name").sort({ sort: 1 });
    console.log(result);
    return res.status(200).send({ status: "ok", items: result });
    // return [];
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  getCateogories,
};
