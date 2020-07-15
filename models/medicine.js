const {Sequelize, DataTypes, INTEGER} = require('sequelize')
const sequelize = require('../utils/db')
const Incoming = require('./in')
const Consumption = require('./out')

const medicine = sequelize.define('Medicine', {
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

medicine.hasMany(Incoming, {onDelete: 'RESTRICT', onUpdate: 'cascade'})
Incoming.belongsTo(medicine)
medicine.hasMany(Consumption, {onDelete: 'RESTRICT', onUpdate: 'cascade'})
Consumption.belongsTo(medicine)


module.exports = medicine