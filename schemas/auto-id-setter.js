const { Schema, Mongoose } = require("mongoose");
const AutoIncrementFactory = require("mongoose-sequence");

/**
 * 해당 스키마에 자동 증가 필드를 추가시켜줍니다.
 * @param {Schema} schema
 * @param {Mongoose} mongoose
 * @param {string} inc_field
 */
module.exports = (schema, mongoose, inc_field) => {
  const AutoIncrement = AutoIncrementFactory(mongoose);
  const option = { id: inc_field, inc_field };
  schema.plugin(AutoIncrement, option);
};