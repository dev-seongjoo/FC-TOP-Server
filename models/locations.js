const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Locations = sequelize.define("Locations", {
  ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  NAME: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  POSITION: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Locations;
