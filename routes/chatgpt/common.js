const { randomUser } = require("./constants");
const Counters = require("../../schemas/Counters");

const getNextSequence = async (name) => {
  const res = await Counters.findOneAndUpdate(
    { _id: name },
    {
      $inc: {
        seq: 1,
      },
    },
    { new: true }
  );
  return res.seq;
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomUser = () => {
  return randomUser[getRandomNumber(0, randomUser.length - 1)];
};

const shuffle = (array) => {
  array.sort(() => Math.random() - 0.5);
};

module.exports = {
  getRandomUser,
  getNextSequence,
  shuffle,
};
