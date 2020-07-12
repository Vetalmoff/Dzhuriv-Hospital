const {Sequelize, DataTypes, INTEGER, DATE} = require('sequelize')
const sequelize = require('../utils/db')
const Medicine = require('./medicine')

const incoming = sequelize.define('Incoming', {
    id: { 
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        validate: {
            isDate: true
        }
    }
})



module.exports = incoming