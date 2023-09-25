const doCron = async (req, res) => {
  try {
    return res.status(200).send({ status: "ok" });
  } catch (e) {
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  doCron,
};
