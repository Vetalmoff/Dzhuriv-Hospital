const {Sequelize, DataTypes, INTEGER} = require('sequelize')
const sequelize = require('../utils/db')

const medicine =sequelize.define('Employee', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
})


module.exports = medicine