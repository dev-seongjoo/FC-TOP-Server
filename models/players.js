const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Players = sequelize.define("Players", {
  ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  LOGIN_ID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  PASSWORD: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  KOR_NM: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ENG_NM: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  PHONE: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  POSTCODE: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ADDRESS: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  BIRTHDAY_YMD: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  POSITION_FIRST: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  POSITION_SECOND: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  POSITION_THIRD: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  FOOT: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  REFRESH_TOKEN: {
    type: DataTypes.STRING,
    allowNull: true, // refreshToken은 사용자가 로그인 하지 않았을 때 null이 될 수 있습니다.
  },
});

module.exports = Players;
