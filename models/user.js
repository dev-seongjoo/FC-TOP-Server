const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const User = sequelize.define("User", {
  ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  KOR_LAST_NM: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  KOR_FIRST_NM: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ENG_LAST_NM: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ENG_FIRST_NM: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PASSWORD: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PHONE_NO: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  POSTCODE_NO: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ADDRESS: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  BIRTHDAY_YMD: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  POSITION_FIRST: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  POSITION_SECOND: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  POSITION_THIRD: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  FOOT: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
