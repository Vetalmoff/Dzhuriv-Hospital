const {Sequelize, DataTypes, INTEGER, STRING} = require('sequelize')
const sequelize = require('../utils/db')


const consumption = sequelize.define('Consumption', {
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




module.exports = consumption