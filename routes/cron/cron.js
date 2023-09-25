const BASE_URL = process.env.BASE_URL || "http://localhost:3001";
const axios = require("axios");

const doCron = async (req, res) => {
  try {
    // await axios(`${BASE_URL}/api/chatgpt/social`);
    await axios(`${BASE_URL}/api/chatgpt/economy_investing`);
    await axios(`${BASE_URL}/api/chatgpt/life_health`);
    await axios(`${BASE_URL}/api/chatgpt/economy_crypto`);
    await axios(`${BASE_URL}/api/chatgpt/america`);
    return res.status(200).send({ status: "ok" });
  } catch (e) {
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  doCron,
};
