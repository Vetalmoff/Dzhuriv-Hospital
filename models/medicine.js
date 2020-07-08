const {Sequelize, DataTypes, INTEGER} = require('sequelize')
const sequelize = require('../utils/db')

const medicine =sequelize.define('Medicine', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
})




module.exports = medicine