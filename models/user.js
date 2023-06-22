const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  korLastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  korFirstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  engLastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  engFirstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cellPhone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birth: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  foot: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
