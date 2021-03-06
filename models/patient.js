const {Sequelize, DataTypes, INTEGER} = require('sequelize')
const sequelize = require('../utils/db')
const Consumption = require('./out')


const patient = sequelize.define('Patient', {
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
    dateOfBirdth: {
        type: DataTypes.DATE,
        allowNull:true
    },
    description: {
        type: DataTypes.STRING
    }
})

patient.hasMany(Consumption, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    foreignKey: {
    name: 'patient'
    }
})
Consumption.belongsTo(patient, {
    foreignKey: {
        name: 'patient'
    }
})


module.exports = patient