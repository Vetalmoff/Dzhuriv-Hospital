const {Sequelize, DataTypes, INTEGER} = require('sequelize')
const sequelize = require('../utils/db')
const Consumption = require('../models/out')

const employee = sequelize.define('Employee', {
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

employee.hasMany(Consumption, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    foreignKey: {
    name: 'employee'
    }
})
Consumption.belongsTo(employee, {
    foreignKey: {
        name: 'employee'
    }
})


module.exports = employee