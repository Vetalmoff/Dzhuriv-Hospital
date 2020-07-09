const {Sequelize, DataTypes, INTEGER} = require('sequelize')
const sequelize = require('../utils/db')
const Consumption = require('../models/out')


const pacient = sequelize.define('Pacient', {
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
    age: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    description: {
        type: DataTypes.STRING
    }
})

pacient.hasMany(Consumption, {foreignKey: {
    name: 'pacient'
    }
})

module.exports = pacient