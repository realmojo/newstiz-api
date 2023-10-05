const os = require("os");
const ip = require("ip");
const moment = require("moment");

const getPing = async (req, res) => {
  try {
    return res
      .status(200)
      .send({
        status: "ok",
        os: os.hostname(),
        ip: ip.address(),
        date: moment().format("YYYY-MM-DD HH:mm"),
      });
  } catch (e) {
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  getPing,
};
