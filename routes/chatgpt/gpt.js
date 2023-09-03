const getKeyword = async (req, res, next) => {
  try {
    return res.status(200).send({ status: "ok" });
  } catch (e) {
    return next({
      status: "error",
      message: e.message,
    });
  }
};

module.exports = {
  getKeyword,
};
