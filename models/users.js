const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Users = sequelize.define("Users", {
  ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  USER_ID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  USER_PASSWORD: {
    type: DataTypes.STRING,
    allowNull: false,
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
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true, // refreshToken은 사용자가 로그인 하지 않았을 때 null이 될 수 있습니다.
  },
});

module.exports = Users;
