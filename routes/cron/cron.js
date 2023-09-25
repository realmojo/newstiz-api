const BASE_URL = "https://newstiz-api.vercel.app";
const axios = require("axios");

const doCron = async (req, res) => {
  try {
    axios(`${BASE_URL}/api/chatgpt/social`);
    axios(`${BASE_URL}/api/chatgpt/economy_investing`);
    axios(`${BASE_URL}/api/chatgpt/life_health`);
    axios(`${BASE_URL}/api/chatgpt/economy_crypto`);
    axios(`${BASE_URL}/api/chatgpt/america`);
    return res.status(200).send({ status: "ok" });
  } catch (e) {
    return res.status(500).send({ status: "err", message: e.message });
  }
};

module.exports = {
  doCron,
};
