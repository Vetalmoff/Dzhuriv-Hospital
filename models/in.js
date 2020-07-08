const {Sequelize, DataTypes, INTEGER} = require('sequelize')
const sequelize = require('../utils/db')

const incoming = sequelize.define('Incoming', {
    id: { 
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER
    }
})


module.exports = incoming