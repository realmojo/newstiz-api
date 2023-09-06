const { randomUser } = require("./constants");
const Counter = require("../../schemas/Counter");

const getNextSequence = async (name) => {
  const res = await Counter.findOneAndUpdate(
    { _id: name },
    {
      $inc: {
        seq: 1,
      },
    },
    { new: true }
  );
  console.log(res);
  return res.seq;
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomUser = () => {
  return randomUser[getRandomNumber(0, getRandomNumber.length)];
};

const shuffle = (array) => {
  array.sort(() => Math.random() - 0.5);
};

module.exports = {
  getRandomUser,
  getNextSequence,
  shuffle,
};
