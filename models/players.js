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
    allowNull: false,
  },
  PASSWORD: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  KOR_NM: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ENG_NM: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PHONE: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  POSTCODE: {
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
  REFRESH_TOKEN: {
    type: DataTypes.STRING,
    allowNull: true, // refreshToken은 사용자가 로그인 하지 않았을 때 null이 될 수 있습니다.
  },
});

module.exports = Players;
